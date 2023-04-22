import { Tag, Card } from 'antd';
import React, { useState, useRef } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { BOT_STATUS, INDUSTRY } from '@/config/dict';
import { transformValToLabel } from '@/utils';
import moment from 'moment';

const BotCard: React.FC = (props: any) => {
  const botItem = props.value;

  const handleCardClick = () => {
    console.log('handleCardClick');
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    props.cardClick && props.cardClick(botItem);
  };

  return (
    <Card
      hoverable={true}
      onClick={handleCardClick}
      title={botItem.name}
      extra={<Tag color="orange">{transformValToLabel(botItem.status, BOT_STATUS)}</Tag>}
      style={{ flex: 1, margin: '0 20px' }}
      actions={[
        <SettingOutlined onClick={console.log('wewew')} key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
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
