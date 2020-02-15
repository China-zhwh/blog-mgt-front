import { parse } from 'url';
import mockjs from 'mockjs';

//*统一定义数据源，用于后续的添加和删除
let tableListDataSource = [];
tableListDataSource = mockjs.mock({
  'list|100': [{ 'key|+1': 1, name: '@cname', email: '@email', website: '@domain' }],
});

//  作息时间
const catagoryList = mockjs.mock({
  'list|7': [
    {
      'key|+1': 1,
      'id|+1': 1,
      name: '',
      'category|+1': ['上午1', '上午2', '上午3', '上午4', '下午1', '下午2', '下午3'],
      time: { startTime: '@time', endTime: '@time' },
    },
  ],
});

// console.log(catagoryList);

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

function getUserList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  //解析查询参数
  const params = parse(url, true).query;

  //通过mockjs生成随机数据
  //https://cloud.tencent.com/developer/article/1330971
  let dataSource = tableListDataSource.list;
  const pageSize = 10;

  //查询参数过滤
  if (params.name) {
    dataSource = dataSource.filter(e => params.name === e.name);
  }

  //通过param传递的pagesize,和currentpage可以用于分页
  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  //*模拟网络请求延迟
  setTimeout(() => {
    return res.json(mockSuccessObj(result));
  }, 1000);
}

function addUser(req, res, u, b) {
  //*获取URL
  //先从参数获取
  //如果参数中url为空，或是不是字符串，则通过req.url中取
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  //*获取post中的值
  const body = (b && b.body) || req.body;
  const i = Math.ceil(Math.random() * 10000);
  tableListDataSource.list.unshift({
    key: i,
    name: body.name,
    email: body.email,
    website: body.website,
  });

  setTimeout(() => {
    return res.json(mockSuccessObj());
  }, 1000);
}

function getUser(req, res, u) {
  //获取URL
  //先从参数获取
  //如果参数中url为空，或是不是字符串，则通过req.url中取
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  //解析查询参数
  const params = parse(url, true).query;

  const result = tableListDataSource.list.find(
    value =>
      //注意这里使用了双等号，而不是三等号，因为参数是字符串类型，而待比较的事整形
      // eslint-disable-next-line eqeqeq
      value.key == params.id
  );

  setTimeout(() => {
    return res.json(mockSuccessObj(result));
  }, 1000);
}

function editUser(req, res, u, b) {
  //获取URL
  //先从参数获取
  //如果参数中url为空，或是不是字符串，则通过req.url中取
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  //获取post中的值
  const body = (b && b.body) || req.body;
  //解析查询参数
  const params = parse(url, true).query;

  const result = tableListDataSource.list.findIndex(
    value =>
      //注意这里使用了双等号，而不是三等号，因为参数是字符串类型，而待比较的事整形
      // eslint-disable-next-line eqeqeq
      value.key == params.id
  );

  if (result >= 0) {
    tableListDataSource.list[result] = {
      key: tableListDataSource.list[result].key,
      name: body.name,
      email: body.email,
      website: body.website,
    };
  }

  setTimeout(() => {
    return res.json(mockSuccessObj());
  }, 1000);
}

function deleteUser(req, res, _u, b) {
  //获取post中的值
  const body = (b && b.body) || req.body;

  if (body.ids) {
    const ids = body.ids.split(',');
    ids.forEach(e => {
      const result = tableListDataSource.list.findIndex(
        value =>
          //注意这里使用了双等号，而不是三等号，因为参数是字符串类型，而待比较的事整形
          // eslint-disable-next-line eqeqeq
          value.key == e
      );
      if (result >= 0) {
        tableListDataSource.list.splice(result, 1);
      }
    });
  }

  setTimeout(() => {
    return res.json(mockSuccessObj());
  }, 1000);
}

function getCategoryList(_, res) {
  setTimeout(() => {
    return res.json(mockSuccessObj(catagoryList.list));
  }, 1000);
}

export default {
  'GET /api/common/user/list': getUserList,
  'POST /api/common/user/add': addUser,
  'GET /api/common/user/get': getUser,
  'POST /api/common/user/edit': editUser,
  'POST /api/common/user/delete': deleteUser,
  'GET /api/common/category/list': getCategoryList,
};
