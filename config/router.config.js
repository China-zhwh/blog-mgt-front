import antdPageRoutes from './antd.router.config';

/**
 * 主要用于将antd pro的路由和工程本身的路由分隔开，避免混淆
 * 以后，菜单的获取肯定要从后台，而不是从路由中抽取。
 */
const customRoutes = [
  {
    path: '/',
    redirect: '/common',
  },
  {
    path: '/common',
    redirect: '/common/sample/userlist',
  },
  {
    path: '/common/sample',
    name: '举个栗子',
    icon: 'smile',
    routes: [
      {
        path: '/common/sample/userlist',
        component: './Sample/UserList',
        name: '用户管理',
      },
      {
        path: '/common/sample/useredit/:id',
        component: './Sample/UserEdit',
        name: '编辑用户信息',
        hideInMenu: true,
      },
      {
        path: '/common/sample/dynamicform',
        component: './Sample/dynamicform',
        name: '动态表单',
      },
    ],
  },
  {
    path: '/common/blog',
    name: '博客管理',
    icon: 'smile',
    routes: [
      {
        path: '/common/blog/bloglist',
        component: './Blog/BlogList',
        name: '博客列表',
      },
      {
        path: '/common/blog/blogedit/:id',
        component: './Blog/BlogEdit',
        name: '编辑博客信息',
        hideInMenu: true,
      },
    ],
  },
];

//  判断是否显示antd pro的菜单
const { ANTD_PRO_MENU } = process.env;
if (!ANTD_PRO_MENU) {
  //  只显示exception
  antdPageRoutes[1].routes = antdPageRoutes[1].routes.filter(e => e.name && e.name === 'exception');
}
//将路由插入and pro内置的路由中
antdPageRoutes[1].routes.unshift(...customRoutes);

export default antdPageRoutes;
