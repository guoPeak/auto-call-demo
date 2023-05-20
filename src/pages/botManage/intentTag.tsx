import React, { useState, useRef } from 'react';
import { Space, Table, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


const IntentTag: React.FC = () => {

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);


  const dataSource = [
    {
      key: '1',
      rule: '通话时长大于等于70秒',
      tags: 'A级（有明确意向）',
      matchCount: 5,
    },
    {
      key: '1',
      rule: '客户最后通话拒绝',
      tags: 'C级（明确拒绝）',
      matchCount: 1,
    },
  ];
  
  const columns = [
    {
      title: '判断顺序',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: '规则',
      dataIndex: 'rule',
      key: 'rule',
    },
    {
      title: '客户意向标签',
      dataIndex: 'tags',
      key: 'tags',
    },
    {
      title: '匹配次数',
      dataIndex: 'matchCount',
      key: 'matchCount',
    },
    {
      title: '操作',
      dataIndex: 'options',
      key: 'options',
    }
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  
  return <div>
    <Space wrap size={[16, 10]} style={{marginBottom: '20px'}}>
      <Button type='primary'> <PlusOutlined /> 添加判断规则</Button>
      <Button type='primary'>批量删除</Button>
    </Space>
    <Table dataSource={dataSource} columns={columns} rowSelection={rowSelection} />
  </div>
};

export default IntentTag;
