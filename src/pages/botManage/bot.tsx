import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Input, Form, Row, Col, Select, Card } from 'antd';
import React, { useState, useEffect } from 'react';
// import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import BotCard from './components/botCard';
import { getBotList, createBotTalk } from './service';
import { history } from 'umi';
import {
  BOT_STATUS as botStatus,
  BOT_RANAGE as BotRanage,
  INDUSTRY as industryDict,
} from '@/config/dict';

import './bot.less';

const TableList: React.FC = () => {
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [modalLoading, setmodalLoading] = useState<boolean>(false);

  const [list, setList] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [serchForm] = Form.useForm();
  const [submitForm] = Form.useForm();

  const getList = async (obj: any) => {
    const res = await getBotList({
      pageNo: 1,
      pageSize: 20,
      ...obj,
    });
    setList(res.list);
  };

  const handleOk = () => {
    submitForm.validateFields().then(async (data) => {
      setmodalLoading(true);
      console.log(data);
      await createBotTalk(data);
      setmodalLoading(false);
      setIsModalOpen(false);
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const newBot = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    getList({});
  }, []);

  // setTimeout(() => {
  //     getList({})
  // }, 500);

  const cardClick = (card: any) => {
    console.log('cardClick', card);
    history.push({
      pathname: `/process/${card.id}`,
      // query: {
      //     id: card.id,
      // },
    });
  };

  const onFinish = async (obj: any) => {
    console.log(obj);
    setButtonLoading(true);
    await getList(obj);
    setButtonLoading(false);
  };

  const handleReset = () => {
    serchForm.resetFields();
  };

  return (
    <Card>
      <Form form={serchForm} onFinish={onFinish} layout="inline">
        <Form.Item label="Bot名称和Id" name="name">
          <Input placeholder="请输入Bot名称和Id" />
        </Form.Item>
        <Form.Item label="Bot状态" name="status">
          <Select placeholder="请选择Bot状态" allowClear>
            {botStatus.map((item) => {
              return (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="Bot范围" name="botRange">
          <Select placeholder="请选择Bot范围" allowClear>
            {BotRanage.map((item) => {
              return (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            loading={buttonLoading}
            htmlType="submit"
            style={{ marginRight: '16px', marginLeft: '30px' }}
          >
            查询
          </Button>
          <Button type="primary" onClick={handleReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
      <Button style={{ marginTop: '30px' }} onClick={newBot} type="primary">
        <PlusOutlined /> 新建
      </Button>
      {/* <div className='flex card-wrapper'> */}
      <Row gutter={24}>
        {list.map((item) => {
          return (
            <Col className="card-wrapper" span={8} key={item.id}>
              <BotCard value={item} cardClick={cardClick} />
            </Col>
          );
        })}
      </Row>

      {/* </div> */}

      <Modal
        title="新建"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ loading: modalLoading }}
      >
        <Form form={submitForm} labelCol={{ span: 4 }}>
          <Form.Item
            label="Bot名称"
            name="name"
            rules={[{ required: true, message: '请输入Bot名称' }]}
          >
            <Input placeholder="请输入Bot名称" />
          </Form.Item>
          <Form.Item label="行业" name="trade" initialValue={0}>
            <Select placeholder="请选择行业">
              {industryDict.map((item) => {
                return (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Bot范围" name="botDesc">
            <Input.TextArea rows={2} placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TableList;
