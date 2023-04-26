import { Tag, Card } from 'antd';
import React, { useState, useRef } from 'react';
import { EditOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { BOT_STATUS, INDUSTRY } from '@/config/dict';
import { transformValToLabel } from '@/utils';
import moment from 'moment';

const BotCard: React.FC = (props: any) => {
  const botItem = props.value;
  const { cardClick, editBot, copyBot, deleteBot } = props;

  const handleCardClick = () => {
    console.log('handleCardClick');
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    cardClick && cardClick(botItem);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    editBot && editBot(botItem);
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    copyBot && copyBot(botItem);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteBot && deleteBot(botItem);
  };

  return (
    <Card
      hoverable={true}
      onClick={handleCardClick}
      title={botItem.name}
      extra={<Tag color="orange">{transformValToLabel(botItem.status, BOT_STATUS)}</Tag>}
      style={{ flex: 1, margin: '0 20px' }}
      actions={[
        <EditOutlined key="edit" onClick={handleEdit} />,
        <CopyOutlined key="copy" onClick={handleCopy} />,
        <DeleteOutlined key="delete" onClick={handleDelete} />,
      ]}
    >
      <p>BotID：{botItem.id}</p>
      <p>行业：{transformValToLabel(botItem.trade, INDUSTRY)}</p>
      <p>录音方式：{botItem.RecordMethod}</p>
      <p>录音师：{botItem.infromant}</p>
      <p>更新时间：{moment(botItem.updateTime).format('YYYY-MM-DD HH:mm:ss')}</p>
    </Card>
  );
};

export default BotCard;
