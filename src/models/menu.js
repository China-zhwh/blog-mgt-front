import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import { menu } from '../defaultSettings';
import { queryUserFunctionAuthority } from '@/services/user';
import { setFunctionAuthority } from '@/utils/userInfo';
import Authorized, { reloadAuthorized } from '@/utils/Authorized';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      // 没有设置 disableLocal 暂时页面上会报js错误
      // if enableMenuLocale use item.name,
      // close menu international
      const name = menu.disableLocal
        ? item.name
        : formatMessage({ id: locale, defaultMessage: item.name });
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

//  通过从服务器返回的信息组装菜单信息
function populateMenuFromServer(data, routes = []) {
  //  在路由中搜索匹配的url
  const searchRouteByUrl = (url, searchRoutes = routes) => {
    if (!url) {
      return undefined;
    }
    const result = searchRoutes.find(e => {
      if (e.path && e.path === url) {
        return true;
      }
      return false;
    });
    if (result !== undefined) return result;

    // eslint-disable-next-line no-restricted-syntax
    for (const e of searchRoutes) {
      if (e.routes) {
        const subResult = searchRouteByUrl(url, e.routes);
        if (subResult !== undefined) return subResult;
      }
    }

    return undefined;
  };

  //  组装单个menu节点
  const populteSingleMenu = (node, route) => {
    let obj = {
      children: [],
      name: node.functionNameCn,
      path: node.functionNameEn, //  占住path，用于生成key 参见BaseMenu.js，否则会出现warning
      functionId: node.functionSapiId,
      pubDisplayOrder: node.pubDisplayOrder,
    };
    if (route) {
      obj = { ...obj, path: route.path, icon: route.icon, hideInMenu: route.hideInMenu };
    }

    return obj;
  };

  let firstClassMenu = [];
  //找出第一级菜单
  data.forEach(e => {
    if (!e.functionParentId) {
      const route = searchRouteByUrl(e.functionUrl);
      const o = populteSingleMenu(e, route);

      firstClassMenu.push(o);
    }
  });

  //  找到第二级菜单
  data.forEach(e => {
    if (e.functionParentId) {
      firstClassMenu.forEach(firstClassE => {
        if (firstClassE.functionId === e.functionParentId.functionSapiId) {
          const route = searchRouteByUrl(e.functionUrl);
          const o = populteSingleMenu(e, route);
          firstClassE.children.push(o);
        }
      });
    }
  });

  //  找到第三级菜单
  data.forEach(e => {
    if (e.functionParentId && e.functionParentId.functionSapiId) {
      firstClassMenu.forEach(firstClassE => {
        firstClassE.children.forEach(secondClassE => {
          if (secondClassE.functionId === e.functionParentId.functionSapiId) {
            const route = searchRouteByUrl(e.functionUrl);
            const o = populteSingleMenu(e, route);
            secondClassE.children.push(o);
          }
        });
      });
    }
  });

  //  找到第四级菜单
  data.forEach(e => {
    if (e.functionParentId && e.functionParentId.functionSapiId) {
      firstClassMenu.forEach(firstClassE => {
        firstClassE.children.forEach(secondClassE => {
          secondClassE.children.forEach(thirdClassE => {
            //  非按钮权限
            if (
              thirdClassE.functionId === e.functionParentId.functionSapiId &&
              e.buttonFlag === false
            ) {
              const route = searchRouteByUrl(e.functionUrl);
              const o = populteSingleMenu(e, route);
              thirdClassE.children.push(o);
            }
          });
        });
      });
    }
  });

  //  排序第一级菜单
  firstClassMenu = firstClassMenu.sort((a, b) => a.pubDisplayOrder - b.pubDisplayOrder);

  //  排序第二级,第三级菜单,第四级菜单
  firstClassMenu.forEach(e => {
    e.children = e.children.sort((a, b) => a.pubDisplayOrder - b.pubDisplayOrder);
    e.children.forEach(secondClassE => {
      // eslint-disable-next-line no-param-reassign
      secondClassE.children = secondClassE.children.sort(
        (a, b) => a.pubDisplayOrder - b.pubDisplayOrder
      );
      secondClassE.children.forEach(thirdClassE => {
        // eslint-disable-next-line no-param-reassign
        thirdClassE.children = thirdClassE.children.sort(
          (a, b) => a.pubDisplayOrder - b.pubDisplayOrder
        );
      });
    });
  });

  //  和后端接口商量，不需要第一级
  let result = [];
  firstClassMenu.forEach(e => {
    result = result.concat(e.children);
  });
  return result;
}

//  过滤出用户权限信息
const filterFucntionAuthorityFromServer = data => {
  const result = [];
  data.forEach(e => {
    if (e.functionUrl && e.buttonFlag === true) {
      result.push(e.functionUrl);
    }
  });
  return result;
};

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    routerData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData({ payload }, { put, call }) {
      const { routes, authority } = payload;
      let originalMenuData;
      if (process.env.NODE_ENV === 'production' || INTEGRATED_TEST) {
        const response = yield call(queryUserFunctionAuthority, payload);
        //console.log('queryUserFunctionAuthority', response);
        originalMenuData = populateMenuFromServer(response.data, routes);

        setFunctionAuthority(filterFucntionAuthorityFromServer(response.data));
        reloadAuthorized();
        //console.log('populateMenuFromServer', originalMenuData);
      } else {
        originalMenuData = memoizeOneFormatter(routes, authority);
      }

      const menuData = filterMenuData(originalMenuData);
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, routerData: routes },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
