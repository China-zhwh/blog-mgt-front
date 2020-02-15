import React from 'react';

import { Input, Form, TimePicker } from 'antd';

import moment from 'moment';

const FormItem = Form.Item;
//  用于向单元格
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

//  对于table中的每一行创建一个form
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  save = e => {
    const { record, handleSave } = this.props;

    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      //  console.log('values',values.time_startTime.format());
      //  console.log({ ...record, ...values });
      handleSave({ ...record, ...values });
    });
  };

  renderEditableCell({ form, type, record, dataIndex }) {
    this.form = form;
    // console.log('renderEidtableCell', record);
    let result;
    if (type === 'input') {
      result = (
        <FormItem style={{ margin: 0 }} wrapperCol={{ span: 24 }}>
          {form.getFieldDecorator(dataIndex, {
            // rules: [
            //   {
            //     required: true,
            //   },
            // ],
            initialValue: record[dataIndex],
          })(<Input onPressEnter={this.save} onBlur={this.save} />)}
        </FormItem>
      );
    } else if (type === 'timeRange') {
      result = (
        <Form layout="inline">
          <FormItem>
            {form.getFieldDecorator(`startTime`, {
              initialValue: moment(record[dataIndex].startTime, 'HH:mm:ss'),
            })(
              <TimePicker
                onOpenChange={open => {
                  if (!open) {
                    this.save();
                  }
                }}
                format="HH:mm"
              />
            )}
          </FormItem>
          <FormItem>
            {form.getFieldDecorator(`endTime`, {
              initialValue: moment(record[dataIndex].endTime, 'HH:mm:ss'),
              // trigger : 'onBlur',
            })(
              <TimePicker
                onOpenChange={open => {
                  if (!open) {
                    this.save();
                  }
                }}
                format="HH:mm"
              />
            )}
          </FormItem>
        </Form>
      );
    }
    return result;
  }

  render() {
    const {
      editable,
      type,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              return this.renderEditableCell({ form, type, title, record, dataIndex });
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

export { EditableFormRow, EditableCell };
