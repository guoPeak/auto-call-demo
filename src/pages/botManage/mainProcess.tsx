import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Form, Row, Col, Select, Tabs, Card } from 'antd';
import React, { useState, useRef } from 'react';
import FlowDemo from './components/topology';
import { history } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';



const MainProcess: React.FC = (props: any) => {

    console.log('MainProcess', props);

    const { query } = history.location

    console.log('query', query);

    return (
        <Card>
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="主流程" key="1">
                    <FlowDemo />
                </Tabs.TabPane>
                <Tabs.TabPane tab="意向标签" key="2">
                    Content of Tab Pane 2
                </Tabs.TabPane>
                <Tabs.TabPane tab="Bot设置" key="3">
                    Content of Tab Pane 3
                </Tabs.TabPane>
            </Tabs>
        </Card>
    )

}

export default MainProcess