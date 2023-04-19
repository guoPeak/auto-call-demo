import { Button, Card } from 'antd';
import React, { useState, useRef } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const BotCard: React.FC = (props: any) => {
    const botItem = props.value

    const handleCardClick = () => {
        console.log('handleCardClick');
        props.cardClick && props.cardClick(botItem)
    }

    return (
        <Card hoverable={true} onClick={handleCardClick} title={botItem.name} extra={<a href="#">{botItem.status}</a>} style={{ flex: 1, margin: '0 20px' }} actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />,
        ]}>
            <p>BotID：{botItem.id}</p>
            <p>行业：{botItem.trade}</p>
            <p>录音方式：{botItem.RecordMethod}</p>
            <p>录音师：{botItem.infromant}</p>
            <p>更新时间：{botItem.updateTime}</p>
        </Card>
    )
}

export default BotCard