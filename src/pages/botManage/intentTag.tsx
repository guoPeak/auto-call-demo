import React, { useState, useRef } from 'react';
import { Space, Table, Button, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { INTENT_TAG } from '@/config/dict';


const conditionTypeLabel = ['通话时间', '分值', '访问次数', '标签', '话术流程', '肯定次数', '否定次数']
// const conditionTypeValue = ['1', '2', '3', '4', '5', '6', '7']
const conditionRuleOne = ['大于', '等于']
const conditionRuleTwo = ['包括', '不包括']

const IntentTag: React.FC = () => {

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [editId, setEditId] = useState('')
  const [isModalOpen, setModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [conditionData, setConditionData] = useState<any[]>([])


  const dataSource = [
    {
      id: '1',
      rule: '通话时长大于等于70秒',
      tags: 'A级（有明确意向）',
      matchCount: 5,
    },
    {
      id: '2',
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
      render: (txt, record) => {
        return  <Button onClick={() => editRule(record)} type='link'>编辑</Button>
      }
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

  const addRule = () => {
    setModalOpen(true)
  }

  const editRule = (record) => {
    setModalOpen(true)
    setEditId(record.id)
  }

  const deleteTable = () => {
    return new Promise((r,j)=> {
      if (selectedRowKeys.length > 0) {
        r()
      } else {
        j()
      }
    })
  }

  const batchDelete = () => {
    Modal.confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这些标签吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return deleteTable()
      },
    });
  }



  const addCondition = () => {
    const newData = conditionData.concat([{id: Date.now()}])
    setConditionData(newData)
  }

  const deleteCondition = (index: number) => {
    conditionData.splice(index, 1)
    setConditionData([...conditionData])
  }

  const handleOk = () => {
    
  }

  const handleCancel = () => {
    setConditionData([])
    setModalOpen(false)
  }
  
  return <div>
    <Space wrap size={[16, 10]} style={{marginBottom: '20px'}}>
      <Button type='primary' onClick={addRule}> <PlusOutlined /> 添加判断规则</Button>
      <Button type='primary' disabled={selectedRowKeys.length <= 0} onClick={batchDelete}>批量删除</Button>
    </Space>
    <Table dataSource={dataSource} columns={columns} rowSelection={rowSelection} rowKey={'id'} />

    <Modal
        title={`${editId ? '编辑' : '新建'}判断规则`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ loading: modalLoading }}
      >
        <div>
            <div style={{ fontSize: 16, marginBottom: 20 }}>满足下列条件</div>

            {conditionData.map( (item, i) => <div key={item.id} style={{display: 'flex', alignItems: 'center', marginTop: 20, marginBottom: 20}}>
              <Select style={{flex: 3}} options={conditionTypeLabel.map(e => ({label: e, value: e}))} />
              <Select style={{flex: 1, margin: '0 16px'}} options={conditionRuleOne.map(e => ({label: e, value: e}))} />
              <Input style={{flex: 1}} />
              <DeleteOutlined onClick={() => deleteCondition(i)} style={{fontSize: 18, marginLeft: 10, cursor: 'pointer', color: '#1B1E83'}} />
            </div>)}

            <Button type='primary' onClick={addCondition}>添加条件</Button>
        </div>

        <div style={{margin: '20px 0', fontSize: 16}}>将意向标签等级设置为</div>
        <Select style={{width: 300}} allowClear options={INTENT_TAG} />
      </Modal>
  </div>
};

export default IntentTag;
