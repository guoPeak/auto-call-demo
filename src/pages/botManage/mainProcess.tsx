import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Form, Row, Col, Select, Tabs, Card } from 'antd';
import React, { useState, useRef } from 'react';
import TopologyFlow from './topology';
import { history } from 'umi';
import IntentTag from './intentTag';
import BotSetting from './botSetting';
// import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';

const tabList = [
  {
    key: 'mainProcess',
    tab: '话术流程',
  },
  {
    key: 'intentTag',
    tab: '意向标签',
  },
  {
    key: 'botSetting',
    tab: 'Bot设置',
  },
];

const MainProcess: React.FC = (props: any) => {
  console.log('MainProcess', props);

  const { query } = history.location;

  console.log('query', query);
  const [activeTabKey, setActiveTabKey] = useState<string>('mainProcess');

  const getTabKey = () => {
    const { match, location } = props;
    const url = match.path === '/' ? '' : match.path;
    const tabkey = location.pathname.replace(`${url}/`, '');
    if (tabkey && tabkey !== '/') {
      return tabkey;
    }
    return 'mainProcess';
  };

  const onTab1Change = (key: string) => {
    setActiveTabKey(key);
    // const { match } = props
    // const url = match.path === '/' ? '' : match.path;

    // const currentTab = tabList.find(item => item.key === key)

    // history.push(`${url}/${currentTab}`)
  };

  const renderComponent = () => {
    switch (activeTabKey) {
      case 'mainProcess':
        return <TopologyFlow />;
      case 'intentTag':
        return <IntentTag />;
      case 'botSetting':
        return <BotSetting />;
      default:
        return <MainProcess />;
    }
  };

  return (
    <Card
      style={{ width: '100%' }}
      title="Bot管理"
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={(key) => {
        onTab1Change(key);
      }}
    >
      {renderComponent()}
      {/* <Route path="/bot/mainProcess" exact component={FlowDemo} /> */}
      {/* <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="主流程" key="1">
                    <FlowDemo />
                </Tabs.TabPane>
                <Tabs.TabPane tab="意向标签" key="2">
                    Content of Tab Pane 2
                </Tabs.TabPane>
                <Tabs.TabPane tab="Bot设置" key="3">
                    Content of Tab Pane 3
                </Tabs.TabPane>
            </Tabs> */}
    </Card>
  );
};

export default MainProcess;
