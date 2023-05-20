import { Button, Drawer, Form, Input, Switch,Radio, Tag, Space, Select, Checkbox, Modal, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import BranchInput from './branchInput';
import ExtraSetting from './extraSetting';
import { INTENT_TAG } from '@/config/dict';


const normalFormList = ({ onChange, onClick, branches, data: {tagIds, isIntercept, recall, repeatCount } }) => [
    {
        label: '流程名称',
        name: 'name',
        rule: [{ required: true, message: '请输入流程名称' }],
        children: <Input placeholder="请输入流程名称" onChange={(val) => onChange(val, 'name')} />,
    },
    {
        label: '流程话术',
        name: 'talk',
        rule: [],
        children: (
            <Input.TextArea placeholder="请输入流程话术" onChange={(val) => onChange(val, 'talk')} />
        ),
    },
    {
        label: '回答分支',
        name: 'branches',
        rule: [],
        // children: <Switch checkedChildren="全部" unCheckedChildren="全部" onChange={(val) => onChange(val, 'branch')} />
        children: <BranchInput branches={branches} onChange={(val) => onChange(val, 'branches')} />,
    },
    {
        label: '分值',
        name: 'score',
        rule: [],
        children: <Input type="number" min={1} onChange={(val) => onChange(val, 'score')} />,
    },
    {
        label: '意向标签',
        name: 'tag',
        rule: [],
        children: (
          tagIds ? <Tag onClick={(val) => onClick(val, 'tag')}>{tagIds}</Tag> : <Tag
                onClick={(val) => onClick(val, 'tag')}
                style={{ background: '#fff', borderStyle: 'dashed', cursor: 'pointer' }}
            >
                <PlusOutlined />
                添加意向标签
            </Tag>
        ),
    },
    {
      label: '扩展设置',
      name: 'extraSetting',
      rule: [],
      children: <ExtraSetting isIntercept={isIntercept} recall={recall} repeatCount={repeatCount} onChange={(val: any) => onChange(val, 'extraSetting')}  />
  },
];

const jumpFormList = ({ onChange, onClick, data }) => [
    {
        label: '流程名称',
        name: 'name',
        rule: [{ required: true, message: '请输入流程名称' }],
        children: <Input placeholder="请输入流程名称" onChange={(val) => onChange(val, 'name')} />,
    },
    {
        label: '下一步',
        name: 'nextAction',
        rule: [],
        children: (
            <Select defaultValue="next" onChange={(val) => onChange(val, 'nextAction')}>
                <Select.Option value="hangup">挂机</Select.Option>
                <Select.Option value="next">下一步主动流程</Select.Option>
                <Select.Option value="assign">指定主动流程</Select.Option>
            </Select>
        ),
    },
    {
        label: '分值',
        name: 'score',
        rule: [],
        children: <Input type="number" min={1} onChange={(val) => onChange(val, 'score')} />,
    },
    {
        label: '意向标签',
        name: 'tag',
        rule: [],
        children: (
          data.tagIds ? <Tag onClick={(val) => onClick(val, 'tag')}>{data.tagIds}</Tag> : <Tag
          onClick={(val) => onClick(val, 'tag')}
          style={{ background: '#fff', borderStyle: 'dashed', cursor: 'pointer' }}
      >
          <PlusOutlined />
          添加意向标签
      </Tag>
        ),
    },
    {
      label: '扩展设置',
      name: 'extraSetting',
      rule: [],
      children: <ExtraSetting isIntercept={data.isIntercept} recall={data.recall} repeatCount={data.repeatCount} onChange={(val: any) => onChange(val, 'extraSetting')}  />
  },
];

const conditionFormList = ({ onChange, branches }) => [
    {
        label: '流程名称',
        name: 'name',
        rule: [{ required: true, message: '请输入流程名称' }],
        children: <Input placeholder="请输入流程名称" onChange={(val) => onChange(val, 'name')} />,
    },
    {
        label: '节点分支',
        name: 'branch',
        rule: [],
        // children: <Switch onChange={(val) => onChange(val, 'branch')} checkedChildren="全部" unCheckedChildren="全部" />
        // children: <BranchInput branches={branches} onChange={(val) => onChange(val, 'branches')} />
        children: branches.map((item) => <Tag key={item.name}>{item.name}</Tag>),
    },
];

const hangupFormList = ({ onChange, onClick }) => [
    {
        label: '流程名称',
        name: 'name',
        rule: [{ required: true, message: '请输入流程名称' }],
        children: <Input placeholder="请输入流程名称" onChange={(val) => onChange(val, 'name')} />,
    },
    {
        label: '流程话术',
        name: 'talk',
        rule: [],
        children: (
            <Input.TextArea placeholder="请输入流程话术" onChange={(val) => onChange(val, 'talk')} />
        ),
    },
    {
        label: '分值',
        name: 'score',
        rule: [],
        children: <Input type="number" min={1} onChange={(val) => onChange(val, 'score')} />,
    },
    {
        label: '标签',
        name: 'tag',
        rule: [],
        children: (
            <Tag
                onClick={(val) => onClick(val, 'tag')}
                style={{ background: '#fff', borderStyle: 'dashed', cursor: 'pointer' }}
            >
                <PlusOutlined />
                添加意向标签
            </Tag>
        ),
    },
    // {
    //     label: '扩展设置',
    //     name: 'extraSetting',
    //     rule: [],
    //     children: <Checkbox.Group onChange={(val) => onChange(val, 'extraSetting')}>
    //         <Row><Checkbox value="a">允许用户打断</Checkbox></Row>
    //         <Row><Checkbox value="b">节点重复</Checkbox></Row>
    //     </Checkbox.Group>
    // }
];

const nodeNameMap = {
    1: '编辑普通流程',
    2: '编辑跳转流程',
    3: '编辑条件判断节点',
    4: '编辑挂机节点',
};

const getCurrentFormList = (key: number, props: any) => {
    switch (key) {
        case 1:
            return normalFormList(props);
        case 2:
            return jumpFormList(props);
        case 3:
            return conditionFormList(props);
        case 4:
            return hangupFormList(props);
        default:
            return normalFormList(props);
    }
};

const TalkDrawer: React.FC = (props: any) => {
    const { open, setOpen, data, save } = props;

    const title = nodeNameMap[data.type];

    const [branches, setBranches] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false)
    const [curtagIds, setCurTagIds] = useState(data.tagIds)


    const onChange = (val: any, key: any) => {
        console.log('onChange ==== >>', key, val);
        if (key === 'branches') {
            const checkedVal = val?.filter(item => item.selected)
            const branchIds = checkedVal?.map((item) => item.id).join(',');
            const branchNames = checkedVal?.map((item) => item.name).join(',');
            data.branchIds = branchIds;
            data.branchNames = branchNames;
            data.branches = branches
            console.log('branches onChange ===>', branchIds, branchNames);
            setBranches(val)
        } else if (key === 'nextAction') {
            data[key] = val;
        } else if (key === 'extraSetting') {
          data.isIntercept = val.isIntercept
          data.recall = val.recall
          data.repeatCount = val.repeatCount
        } else {
          data[key] = val.target.value;
        }
    };

    useEffect(() => {

      console.log('TalkDrawer useEffect ====>', data);
        // const branchNamesArr = data.branchNames?.split(',') || [];
        // const branchIdsArr = data.branchIds?.split(',') || [];
        const curBranches = data.branches
        setBranches(curBranches);
    }, [data]);

    const onClick = (val: any, key: any) => {
        console.log('onClick', key, val);
        if (key === 'tag') {
          console.log(curtagIds);
          setModalOpen(true)
        }
    };


    const currentFormList = getCurrentFormList(data.type, { onChange, onClick, data, branches });

    const [form] = Form.useForm();

    const onClose = () => {
        setOpen(false);
    };

    form.setFieldsValue(data);

    const confirm = () => {
        form.validateFields().then((res) => {
            console.log('validateFields', res);
            data.tagIds = curtagIds
            Object.assign({}, data, res);
            save && save(data);
        });
    };

    // const handleOk = () => {

    // }

    const handleTagClick = (e: RadioChangeEvent) => {
     
      const val = e.target.value

      data.tagIds = val
      setCurTagIds(val)
      
    }

    return (
        <Drawer
            title={title}
            width="460"
            placement="right"
            onClose={onClose}
            destroyOnClose={true}
            open={open}
            footer={
                <Space align="end">
                    <Button onClick={onClose}>取消</Button>
                    <Button type="primary" onClick={confirm}>
                        确认
                    </Button>
                </Space>
            }
        >
            <Form labelCol={{ span: 6 }} form={form}>
                {currentFormList.map((item) => (
                    <Form.Item key={item.name} name={item.name} label={item.label} rules={item.rule}>
                        {item.children}
                    </Form.Item>
                ))}
            </Form>
            <Modal
              title="添加意向标签"
              open={isModalOpen}
              onOk={() => setModalOpen(false)}
              onCancel={() => setModalOpen(false)}
              destroyOnClose={true}
            >
              <Form labelCol={{ span: 4 }}>
                <Form.Item label="意向标签" name="keywords" initialValue={curtagIds}>
                  <Radio.Group onChange={handleTagClick}>
                    {INTENT_TAG.map(item => <Radio.Button style={{marginBottom: '8px'}} key={item.value} value={item.label}>{item.label}</Radio.Button>)}
                  </Radio.Group>
                </Form.Item>
              </Form>
            </Modal>
        </Drawer>
    );
};

export default TalkDrawer;
