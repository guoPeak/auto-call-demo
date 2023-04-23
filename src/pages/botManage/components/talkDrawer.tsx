import { Button, Drawer, Form, Input, Switch, Tag } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

const TalkDrawer: React.FC = (props: any) => {
  const { open, setOpen, title } = props;

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Drawer title={title} width="460" placement="right" onClose={onClose} open={open}>
      <Form labelCol={{ span: 6 }}>
        <Form.Item
          label="流程名称"
          name="name"
          rules={[{ required: true, message: '请输入流程名称' }]}
        >
          <Input placeholder="请输入流程名称" />
        </Form.Item>
        <Form.Item label="流程话术">
          <Input.TextArea placeholder="请输入流程话术" />
        </Form.Item>
        <Form.Item label="回答分支">
          <Switch />
        </Form.Item>
        <Form.Item label="分值">
          <Input />
        </Form.Item>
        <Form.Item label="意向标签">
          <Tag style={{ background: '#fff', borderStyle: 'dashed', cursor: 'pointer' }}>
            <PlusOutlined />
            添加意向标签
          </Tag>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default TalkDrawer;
