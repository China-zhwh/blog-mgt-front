import { parse } from 'url';
import Mock from 'mockjs';

/**
 * 教师任课列表数据
 */
const dataSource = Mock.mock({
  //  通过mockjs生成随机数据
  //  https://cloud.tencent.com/developer/article/1330971 参考
  'list|100': [
    {
      'key|+1': 1,
      'id|+1': 1,
      'department|1': ['总务处', '教务处', '政教处', '后勤处'],
      name: '@cname',
      phone: /^1[3-9][0-9]\d{8}/,
      'teachSubject|1': [
        '数学',
        '语文',
        '英语',
        '物理',
        '生物',
        '化学',
        '政治',
        '历史',
        '地理',
        '信息技术',
        '美术',
        '音乐',
      ],
      teachClass: '@cword("一二三四五六七八九")年级@integer("1","10")班',
    },
  ],
});

/**
 * 教职工信息管理数据
 */
const infoListData = Mock.mock({
  'list|100': [
    {
      'key|+1': 1,
      'department|1': ['总务处', '教务处', '总教处', '政教处', '后勤处', '宿管科', '餐厅办'],
      name: '@cname',
      sex: '@integer("0","1")',
      idNumber: '@id',
      dateOfBirth: '@date',
      joinCmPtDate: '@date',
      phone: /^1[3-9][0-9]\d{8}/,
      email: '@email',
      'highestEducation|1': ['专科', '本科', '硕士', '博士'],
      formalEmployee: '@integer("0","1")',
      jobTitle: '@cword("一二三高")级（@cword("小中")学）',
      teachClass: '@cword("一二三四五六七八九")年级@integer("1","10")班',
    },
  ],
});
/**
 * 后台api成功返回的js object
 * //TODO 后期考虑做成一个公用的方法
 */
function mockSuccessObj(data = {}) {
  const result = {
    state: 1,
    message: '操作成功',
    data,
  };
  return result;
}

/**
 * 教师任课管理列表
 */
function getTccrmgList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; //  eslint-disable-line
  }
  //  解析查询参数
  const params = parse(url, true).query;

  const pageSize = parseInt(params.pageSize, 10);
  let searchList = dataSource.list;
  //查询参数过滤
  if (params.name) {
    searchList = searchList.filter(e => params.name === e.name);
  }

  //  通过param传递的pagesize,和currentpage可以用于分页
  const result = {
    list: searchList,
    pagination: {
      total: searchList.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  //  模拟网络请求延迟
  setTimeout(() => {
    return res.json(result);
  }, 500);
}

/**
 * 添加任课老师
 */
function tccrmgAdd(req, res, u, b) {
  //  获取URL
  //  先从参数获取
  //  如果参数中url为空，或是不是字符串，则通过req.url中取
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    ({ url } = req);
  }
  //  获取post中的值
  const body = (b && b.body) || req.body;
  const i = Math.ceil(Math.random() * 10000);
  dataSource.list.unshift({
    key: i,
    id: i,
    ...body,
  });

  setTimeout(() => {
    return res.json(mockSuccessObj());
  }, 500);
}

/**
 * 删除任课老师
 */
function tccrmgDelte(req, res, _u, b) {
  //  获取post中的值
  const body = (b && b.body) || req.body;

  if (body.ids) {
    const { ids } = body;
    ids.forEach(e => {
      const result = dataSource.list.findIndex(
        value =>
          //  注意这里使用了双等号，而不是三等号，因为参数是字符串类型，而待比较的是整形
          //  eslint-disable-next-line
          value.key == e
      );
      if (result >= 0) {
        dataSource.list.splice(result, 1);
      }
    });
  }

  setTimeout(() => {
    return res.json(mockSuccessObj());
  }, 500);
}

/**
 * 修改任课老师
 */
function tccrmgEdit(req, res, _u, b) {
  //  获取post中的值
  const body = (b && b.body) || req.body;
  if (body.id) {
    const { id, name, teachClass, teachSubject } = body;
    const result = dataSource.list.findIndex(value => value.id === id);
    if (result >= 0) {
      dataSource.list[result].name = name;
      dataSource.list[result].teachClass = teachClass;
      dataSource.list[result].teachSubject = teachSubject;
    }
  }

  setTimeout(() => {
    return res.json(mockSuccessObj());
  }, 500);
}

/**
 * 教职工信息管理
 */
function getInfoList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; //  eslint-disable-line
  }
  //  解析查询参数
  const params = parse(url, true).query;
  const pageSize = parseInt(params.pageSize, 10);
  let searchList = infoListData.list;
  //查询参数过滤
  if (params.department) {
    searchList = searchList.filter(e => params.department === e.department);
  }

  if (params.name) {
    searchList = searchList.filter(e => params.name === e.name);
  }
  //  通过param传递的pagesize,和currentpage可以用于分页
  const result = {
    list: searchList,
    pagination: {
      total: searchList.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  //  模拟网络请求延迟
  setTimeout(() => {
    return res.json(result);
  }, 500);
}

/**
 * 删除教职工
 */
function infoDelete(req, res, _u, b) {
  //  获取post中的值
  const body = (b && b.body) || req.body;

  if (body.ids) {
    const { ids } = body;
    ids.forEach(e => {
      const result = infoListData.list.findIndex(value => value.key === e);
      if (result >= 0) {
        infoListData.list.splice(result, 1);
      }
    });
  }

  setTimeout(() => {
    return res.json(mockSuccessObj());
  }, 500);
}

/**
 * 添加教职工
 */
function infoAdd(req, res, u, b) {
  //  获取URL
  //  先从参数获取
  //  如果参数中url为空，或是不是字符串，则通过req.url中取
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    ({ url } = req);
  }
  //  获取post中的值
  const body = (b && b.body) || req.body;
  const i = Math.ceil(Math.random() * 10000);
  infoListData.list.unshift({
    key: i,
    id: i,
    ...body,
  });

  setTimeout(() => {
    return res.json(mockSuccessObj());
  }, 500);
}

/**
 * 获取教职工信息
 */
function getInfoUser(req, res, u) {
  //  获取URL
  //  先从参数获取
  //  如果参数中url为空，或是不是字符串，则通过req.url中取
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  //  解析查询参数
  const params = parse(url, true).query;
  // eslint-disable-next-line eqeqeq
  const result = infoListData.list.find(value => value.key == params.id);

  setTimeout(() => {
    return res.json(mockSuccessObj(result));
  }, 500);
}

/**
 * 修改教职工信息
 */
function editInfoUser(req, res, u, b) {
  //  获取URL
  //  先从参数获取
  //  如果参数中url为空，或是不是字符串，则通过req.url中取
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  //  获取post中的值
  const body = (b && b.body) || req.body;

  const result = infoListData.list.findIndex(
    value =>
      //  注意这里使用了双等号，而不是三等号，因为参数是字符串类型，而待比较的事整形
      //  eslint-disable-next-line eqeqeq
      value.key == body.id
  );

  if (result >= 0) {
    infoListData.list[result] = body;
  }

  setTimeout(() => {
    return res.json(mockSuccessObj());
  }, 1000);
}

export default {
  'GET /base/tccrmg/list': getTccrmgList,
  'POST /base/tccrmg/add': tccrmgAdd,
  'POST /base/tccrmg/delete': tccrmgDelte,
  'POST /base/tccrmg/edit': tccrmgEdit,
  'GET /base/faculty/info/list': getInfoList,
  'POST /base/faculty/info/delete': infoDelete,
  'POST /base/faculty/info/add': infoAdd,
  'GET /base/faculty/info/get': getInfoUser,
  'POST /base/faculty/info/edit': editInfoUser,
};
