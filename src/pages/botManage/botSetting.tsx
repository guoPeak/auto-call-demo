import React, { useState, useRef, useEffect } from 'react';
import { Input, Form, Switch, Button, Select } from 'antd';
import { BOT_STATUS, INDUSTRY } from '@/config/dict';
import { transformValToLabel } from '@/utils';
import { updateBotTalk } from './service';

const BotSetting: React.FC = ({ botData = {} }) => {

  const [botForm] = Form.useForm();

  const onFinish = async () => {
    botForm.validateFields().then(async (data) => {
      const { priority,botDesc, languageSensitivity, tags } = data
      await updateBotTalk({
        ...botData,
        botDesc,
        priority, languageSensitivity, tags,
        id: botData.id,
      }).then(() => {
      
      });
    })
  }

  useEffect(() => {
    botForm.setFieldsValue(botData)
  }, [])
  


  return <Form form={botForm} wrapperCol={{ span: 10 }}  onFinish={onFinish}>
      <Form.Item
        label="Bot名称"
        name="name"
        rules={[{ required: true, message: '请输入Bot名称' }]}
      >
        <div>{botData.name}</div>
      </Form.Item>
      <Form.Item label="行业场景" name="trade" rules={[{ required: true}]}>
        <div>{transformValToLabel(botData.trade, INDUSTRY)}</div>
      </Form.Item>
      <Form.Item label="Bot描述" name="botDesc">
        <Input.TextArea rows={2} placeholder="请输入" />
      </Form.Item>
      <Form.Item label="优先级匹配" name="priority">
          <Select options={[
            {
              value: 1,
              label: '知识库选择',
            },
            {
              value: 2,
              label: '回答分支优先',
            },
            {
              value: 3,
              label: '智能匹配优先',
            },
          ]} />
      </Form.Item>
      <Form.Item label="语言识别灵敏度" name="languageSensitivity">
          <Input placeholder="请输入语言识别灵敏度" />
      </Form.Item>
      <Form.Item label="意向标签" name="tags">
          <Switch />
      </Form.Item>
      <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
          >
            保存
          </Button>
        </Form.Item>
    </Form>
};

export default BotSetting;
