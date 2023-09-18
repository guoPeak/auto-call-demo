import { Tag, Card } from 'antd';
import React, { useState, useRef } from 'react';
import { EditOutlined, CopyOutlined, DeleteOutlined, FileSearchOutlined } from '@ant-design/icons';
import { BOT_STATUS, INDUSTRY } from '@/config/dict';
import { transformValToLabel } from '@/utils';
import moment from 'moment';
import './card.less';

const BotCard: React.FC = (props: any) => {
  const botItem = props.value;
  const { cardClick, editBot, copyBot, deleteBot, approval } = props;

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

  const handleApproval  = (e) => {
    e.stopPropagation();
    approval && approval(botItem)
  }

  return (
    <div className='ant-card-hoverable bot-item'>
      <Card
        onClick={handleCardClick}
        title={botItem.name}
        bordered={false}
        extra={<span className='bot-status'><span className="dot" />{transformValToLabel(botItem.status, BOT_STATUS)}</span>}
        className='card-left'
      >
        <p>BotID：{botItem.botId}</p>
        <p>行业：{transformValToLabel(botItem.industryCode, INDUSTRY)}</p>
        <p>录音方式：{botItem.RecordMethod}</p>
        <p>录音师：{botItem.infromant}</p>
        <p>更新时间：{moment(botItem.updateTime).format('YYYY-MM-DD HH:mm:ss')}</p>
      </Card>
      <div className="card-right" >
          <DeleteOutlined className='card-icon' onClick={handleDelete} />
          <CopyOutlined className='card-icon' onClick={handleCopy} />
          <FileSearchOutlined className='card-icon' onClick={handleApproval} />
          <EditOutlined className='card-icon' onClick={handleEdit} />
      </div>
    </div>
    
    // <div className='ant-card-hoverable bot-item'>
    //     <div className="card-left">
    //       <div className="header">
    //           <div className="title">{botItem.name}</div>
    //           <div className="status">{transformValToLabel(botItem.status, BOT_STATUS)}</div>
    //       </div>
    //       <div className="content">
    //         <p>BotID：{botItem.id}</p>
    //         <p>行业：{transformValToLabel(botItem.trade, INDUSTRY)}</p>
    //         <p>录音方式：{botItem.RecordMethod}</p>
    //         <p>录音师：{botItem.infromant}</p>
    //         <p>更新时间：{moment(botItem.updateTime).format('YYYY-MM-DD HH:mm:ss')}</p>
    //       </div>
    //     </div>
    //     <div className="card-right" />
    // </div>
  );
};

export default BotCard;
