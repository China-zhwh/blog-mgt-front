import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import { Form, Input, Button, Card, message } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;

@connect(({ blog, loading }) => ({
  //直接可以拿到model中的state
  blog,
  //处理loading的情况，详见dva-loading
  loading: loading.models.blog,
}))
@Form.create()
class BlogEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.id = 0;
  }

  componentDidMount() {
    //通过match 可以拿到 url中的内嵌参数  /edit/:id
    //详见readme
    const { dispatch, match } = this.props;
    const { params } = match;
    this.id = params.id;
    //通过payload传值时，请使用payload:{key:value}的形式（不要使用单值的模式）
    dispatch({
      type: 'blog/get',
      payload: { id: params.id },
    });
  }

  handleFormSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();

    //与 validateFields 相似，但校验完后，如果校验不通过的菜单域不在可见范围内，则自动滚动进可见范围
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;

      dispatch({
        type: 'blog/edit',
        payload: {
          id: this.id,
          formValues: fieldsValue,
        },
        callback: () => {
          message.success('编辑用户成功！');
          this.handleReturn();
        },
      });
    });
  };

  /**
   * 处理表单返回
   */
  handleReturn = () => {
    router.push(`/base/sample/bloglist`);
  };

  render() {
    const { loading: submitting, blog: data } = this.props;
    const { form } = this.props;

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <PageHeaderWrapper title="编辑用户信息">
        <Card bordered={false}>
          <form style={{ marginTop: 8 }} onSubmit={this.handleFormSubmit}>
            <FormItem {...formItemLayout} label="用户名">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入至少二个汉字', min: 2 }],
                initialValue: data.blog.name,
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="电子邮箱">
              {form.getFieldDecorator('email', {
                rules: [
                  { required: true, message: '请输入电子邮箱' },
                  {
                    type: 'email',
                    message: '无效的电子邮箱',
                  },
                ],
                initialValue: data.blog.email,
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="个人主页">
              {form.getFieldDecorator('website', {
                initialValue: data.blog.website,
              })(<Input />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => this.handleReturn()}>
                返回
              </Button>
            </FormItem>
          </form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BlogEdit;
