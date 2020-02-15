import { queryBlogList, addBlog, getBlog, editBlog, deleteBlog } from '../service';
/**
 * model的标准写法
 * 1. 只有一个save reducer
 * 2. 所有页面动作均对应一个effects function
 * 3. 所有state均放在model中，并加入注释
 * 4. 注意使用callback
 * 5. 删除动作包含单个删除和批量删除
 */
export default {
  namespace: 'blog',

  state: {
    //选择的行
    selectedRows: [],
    //创建用户的表单是否显示
    createFormVisible: false,
    //载入的表格数据
    list: [],
    //当前正在编辑或显示的blog数据
    blog: {},
  },
  effects: {
    //选择一行数据
    *selectRows({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: { selectedRows: payload.rows },
      });
    },
    //取得用户列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryBlogList, payload);
      yield put({
        type: 'save',
        payload: { list: response.data },
      });
    },
    //处理创建窗口的显示和关闭
    *showOrCloseCreateForm({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: { createFormVisible: payload.flag },
      });
    },
    //创建用户
    *add({ payload, callback }, { call }) {
      const response = yield call(addBlog, payload.formValues);
      if (callback && response.state) callback();
    },
    //获取用户
    *get({ payload }, { call, put }) {
      const response = yield call(getBlog, payload);
      yield put({
        type: 'save',
        payload: { blog: response.data },
      });
    },
    //编辑用户
    *edit({ payload, callback }, { call }) {
      const response = yield call(editBlog, payload);
      if (callback && response.state) callback();
    },
    //删除用户（包括批量删除）
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteBlog, payload);
      if (response.state) {
        if (payload.ids.length > 1) {
          //当是批量删除时，删除后，清空选择
          yield put({
            type: 'save',
            payload: { selectedRows: [] },
          });
        }
        if (callback) callback();
      }
    },
  },
  reducers: {
    //保存state
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
