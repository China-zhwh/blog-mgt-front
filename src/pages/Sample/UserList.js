import styles from './UserList.less';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import { Row, Col, Card, Form, Input, Button, Modal, message, Divider } from 'antd';

//先导入原生组件，后导入自定义组件
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { createFormVisible, form, handleAdd, handleModalVisible, loading } = props;
  const okHandle = () => {
    /**
         * validateFields:校验并获取一组输入域的值
         * err示例：
         * {
                "userName": {
                    "errors": [
                    {
                        "message": "Please input your username!",
                        "field": "userName"
                    }
                    ]
                },
                "password": {
                    "errors": [
                    {
                        "message": "Please input your Password!",
                        "field": "password"
                    }
                    ]
                }
           }
         * fieldsValue示例：
         {
            "userName": "用户填入的值",
            "password": "用户填入的值",
          }
         */
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose //关闭时销毁model中的子元素
      title="创建用户"
      visible={createFormVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      //*自定义footer按钮，主要为了传入loading，用于在提交按钮时，按钮进入loading状态，防止二次提交
      footer={[
        <Button key="back" onClick={() => handleModalVisible()}>
          返回
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={okHandle}>
          创建
        </Button>,
      ]}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少二个汉字', min: 2 }],
        })(<Input />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="电子邮箱">
        {form.getFieldDecorator('email', {
          rules: [
            { required: true, message: '请输入电子邮箱' },
            {
              type: 'email',
              message: '无效的电子邮箱',
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="个人主页">
        {form.getFieldDecorator('website', {})(<Input />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ sampleUser, loading }) => ({
  //直接可以拿到model中的state
  sampleUser,
  //*处理loading的情况，详见dva-loading
  loading: loading.models.sampleUser,
}))
@Form.create()
class UserList extends PureComponent {
  columns = [
    {
      title: '用户名',
      dataIndex: 'name',
      render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
    },
    {
      title: '个人主页',
      dataIndex: 'website',
    },

    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleDeleteUser(record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUserEdit(record)}>编辑</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sampleUser/fetch',
    });
  }

  handleUserEdit = record => {
    //*注意如何进行页面见传值
    router.push(`/base/sample/useredit/${record.key}`);
  };

  handleDeleteUser = record => {
    const { dispatch } = this.props;
    const deleteUser = id => {
      dispatch({
        type: 'sampleUser/delete',
        payload: {
          ids: [id],
        },
        callback: () => {
          message.success('删除用户成功！');
          this.handleFormReset();
        },
      });
    };
    Modal.confirm({
      title: '删除用户',
      content: '确定删除该用户信息吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteUser(record.key),
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();

    dispatch({
      type: 'sampleUser/fetch',
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      dispatch({
        type: 'sampleUser/fetch',
        payload: { ...fieldsValue },
      });
    });
  };

  //创建用户
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sampleUser/add',
      payload: {
        formValues: fields,
      },
      //*注意提交时尽量使用回调
      callback: () => {
        message.success('创建用户成功！');
        //关闭创建用户窗口
        this.handleModalVisible();
        //添加信息后，重新初始化页面
        this.handleFormReset();
      },
    });
  };

  handleModalVisible = flag => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sampleUser/showOrCloseCreateForm',
      payload: {
        flag: !!flag, //*注意双叹号的用法，表示如果flag为空则是false
      },
    });
  };

  /**
   * 用户选择表单行事件
   */
  handleSelectRows = rows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sampleUser/selectRows',
      payload: { rows },
    });
  };

  /**
   * 批量删除用户
   */
  handleBatchDelete = rows => {
    const { dispatch } = this.props;
    //* 这样写有好找。注意下面的引用不加this
    const deleteUser = ids => {
      dispatch({
        type: 'sampleUser/delete',
        payload: {
          ids,
        },
        callback: () => {
          message.success('删除用户成功！');
          this.handleFormReset();
        },
      });
    };
    Modal.confirm({
      title: '批量删除用户',
      content: '确定进行批量删除用户信息吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () =>
        deleteUser(
          rows.map(e => {
            return e.key;
          })
        ),
    });
  };

  /**
   * 表格变化事件
   */
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;

    // const filters = Object.keys(filtersArg).reduce((obj, key) => {
    //   const newObj = { ...obj };
    //   newObj[key] = getValue(filtersArg[key]);
    //   return newObj;
    // }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      //...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'sampleUser/fetch',
      payload: params,
    });
  };

  //查询页
  renderQueryForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="电子邮箱">
              {getFieldDecorator('email')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { sampleUser: data, loading } = this.props;
    const { selectedRows } = data;
    const { createFormVisible } = data;
    console.log(this.props, 'props');
    return (
      <PageHeaderWrapper title="用户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderQueryForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={() => this.handleBatchDelete(selectedRows)}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data.list}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        {/*创建用户表单，默认不显示*/}
        <CreateForm
          handleAdd={this.handleAdd}
          loading={loading}
          handleModalVisible={this.handleModalVisible}
          createFormVisible={createFormVisible}
        />
      </PageHeaderWrapper>
    );
  }
}

export default UserList;
