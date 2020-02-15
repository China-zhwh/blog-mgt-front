import { queryUserList, addUser, getUser, editUser, deleteUser } from '../service';
/**
 * model的标准写法
 * 1. 只有一个save reducer
 * 2. 所有页面动作均对应一个effects function
 * 3. 所有state均放在model中，并加入注释
 * 4. 注意使用callback
 * 5. 删除动作包含单个删除和批量删除
 */
export default {
  namespace: 'sampleUser',

  state: {
    //选择的行
    selectedRows: [],
    //创建用户的表单是否显示
    createFormVisible: false,
    //载入的表格数据
    list: [],
    //当前正在编辑或显示的user数据
    user: {},
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
      const response = yield call(queryUserList, payload);
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
      const response = yield call(addUser, payload.formValues);
      if (callback && response.state) callback();
    },
    //获取用户
    *get({ payload }, { call, put }) {
      const response = yield call(getUser, payload);
      yield put({
        type: 'save',
        payload: { user: response.data },
      });
    },
    //编辑用户
    *edit({ payload, callback }, { call }) {
      const response = yield call(editUser, payload);
      if (callback && response.state) callback();
    },
    //删除用户（包括批量删除）
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteUser, payload);
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
