import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Input, Form, Row, Col, Select, Card } from 'antd';
import React, { useState, useEffect } from 'react';
// import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import BotCard from './components/botCard';
import { getBotList, createBotTalk, deleteBotTalk, updateBotTalk, applyAudit } from './service';
import { history } from 'umi';
import {
  BOT_STATUS as botStatus,
  BOT_RANAGE as BotRanage,
  INDUSTRY as industryDict,
} from '@/config/dict';

import './bot.less';

let editId: any = null;

const TableList: React.FC = () => {
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [modalLoading, setmodalLoading] = useState<boolean>(false);

  const [list, setList] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [totalPage, setTotalPage] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [serchForm] = Form.useForm();
  const [submitForm] = Form.useForm();

  const getList = async (obj: any) => {
    const res = await getBotList({
      pageNo: currentPage,
      pageSize: 20,
      ...obj,
    });
    console.log('getList =======>', currentPage);
    let newList = []
    if (currentPage > 1) {
      newList = [...list, ...res.rows]
    } else {
      newList = [...res.rows]
    }
    setTotalPage(res.total)
    setList(newList);
  };

  const loadMore = () => {
    const page = currentPage + 1
    setCurrentPage(page)
    getList(serchForm.getFieldsValue())
  }

  const handleOk = () => {
    submitForm.validateFields().then(async (data) => {
      setmodalLoading(true);
      console.log(data);
      if (editId) {
        await updateBotTalk({
          ...data,
          botId: editId,
        }).then(() => {
          getList(serchForm.getFieldsValue());
        });
      } else {
        await createBotTalk(data);
      }
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
      pathname: `/process/${card.botId}`,
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

  const editBot = (botItem: any) => {
    editId = botItem.botId;
    submitForm.setFieldsValue(botItem);
    newBot();
  };

  const copyBot = () => {};

  const handleApproval = (botItem: any) => {
    Modal.confirm({
      title: '送审',
      icon: <ExclamationCircleOutlined />,
      content: '确定将该话术送审吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return applyAudit({
          businessId: botItem.botId,
          type: 1
        }).then(() => {
          getList(serchForm.getFieldsValue());
        });
      },
    });
    
  }

  const deleteBot = ({ botId }) => {
    Modal.confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定将当前口令从尴尬口令列表删除？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return deleteBotTalk({ botId }).then(() => {
          getList(serchForm.getFieldsValue());
        });
      },
    });
  };

  return (
    <Card>
      <Form form={serchForm} onFinish={onFinish} layout="inline">
        <Form.Item label="Bot名称和Id" name="name">
          <Input placeholder="请输入Bot名称和Id" />
        </Form.Item>
        <Form.Item label="Bot状态" name="status">
          <Select placeholder="请选择Bot状态" allowClear style={{width: '200px'}}>
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
          <Select placeholder="请选择Bot范围" allowClear style={{width: '200px'}}>
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
            <Col className="card-wrapper" span={8} key={item.botId}>
              <BotCard
                value={item}
                cardClick={cardClick}
                editBot={editBot}
                copyBot={copyBot}
                deleteBot={deleteBot}
                approval={handleApproval}
              />
            </Col>
          );
        })}
      </Row>


      {totalPage > currentPage ? <div style={{marginTop: 20, textAlign: 'center'}}><Button onClick={loadMore}>加载更多</Button></div>: null}
      {/* </div> */}

      <Modal
        title={editId ? '编辑' : '新建'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ loading: modalLoading }}
        afterClose={() => {
          submitForm.resetFields();
          editId = null;
        }}
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
          <Form.Item label="Bot描述" name="botDesc">
            <Input.TextArea rows={2} placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TableList;
