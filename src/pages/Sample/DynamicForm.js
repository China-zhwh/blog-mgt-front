import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Table } from 'antd';
import listStyles from './UserList.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { EditableFormRow, EditableCell } from './EditTableRow';

import './DynamicForm.less';

@connect(({ sampleCategory, loading }) => ({
  sampleCategory,
  loading: loading.models.sampleCategory,
}))
class DynamicForm extends PureComponent {
  columns = [
    {
      title: '课节',
      dataIndex: 'category',
      width: '20%',
    },
    {
      title: '自定义课节名',
      dataIndex: 'name',
      editable: true,
      type: 'input',
      width: '20%',
      align: 'center',
    },
    {
      title: '时间',
      dataIndex: 'time',
      editable: true,
      type: 'timeRange',
      align: 'center',
    },
  ];

  constructor(props) {
    super(props);
    //  页面上显示列表值
    this.holdData = [];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sampleCategory/fetch',
    });
  }

  handleSave = row => {
    console.log('oldrow', row);
    const newData = [...this.holdData];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    if (row.startTime) {
      item.time.startTime = row.startTime.format('HH:mm:ss');
    }
    if (row.endTime) {
      item.time.endTime = row.endTime.format('HH:mm:ss');
    }
    if (row.name) {
      item.name = row.name;
    }
    newData.splice(index, 1, {
      ...item,
    });
    this.holdData = newData;
    console.log('newdata', this.holdData);
  };

  render() {
    const { sampleCategory: data, loading } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          type: col.type,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    this.holdData = data.list;
    return (
      <PageHeaderWrapper title="动态Form Demo">
        <Card bordered={false}>
          <div className={listStyles.tableList}>
            <div className={listStyles.tableListOperator}>
              <Button onClick={this.handleAdd} type="primary">
                增加一行
              </Button>
            </div>
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              loading={loading}
              dataSource={data.list}
              columns={columns}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DynamicForm;
