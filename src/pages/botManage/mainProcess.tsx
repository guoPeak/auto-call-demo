import { PlusOutlined } from '@ant-design/icons';
import { Button, Descriptions, Input, Drawer, Form, Row, Col, Select, Tabs, Card } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
// import TopologyFlow from './topology';
import { history, useParams } from 'umi';
// import IntentTag from './intentTag';
// import BotSetting from './botSetting';
import { PageContainer } from '@ant-design/pro-layout';
import { getBotList } from './service';
import { BOT_STATUS, INDUSTRY } from '@/config/dict';
import { transformValToLabel } from '@/utils';
import moment from 'moment';
import './main.less';
const tabList = [
  {
    key: 'topology',
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

  const [botData, setBotData] = useState<any>({});

  // const { query } = history.location;

  // const historyParams = useRouteMatch()
  // const params = useParams()

  // console.log('query', JSON.stringify(params), historyParams);
  // const [activeTabKey, setActiveTabKey] = useState<string>('mainProcess');

  const getMatchUrl = () => {
    const { match, location } = props;
    const url = match.path === '/' ? '' : match.path;
    const paramsTabkey = location.pathname.replace(`${url}/`, '').split('/');
    return {
      url,
      id: paramsTabkey[0],
      path: paramsTabkey[1],
    };
  };

  const getTabKey = () => {
    // const { match, location } = props;
    // const url = match.path === '/' ? '' : match.path;
    // const paramsTabkey = location.pathname.replace(`${url}/`, '');
    // const tabkey = paramsTabkey.split('/')[1]
    const tabkey = getMatchUrl().path;
    if (tabkey && tabkey !== '/') {
      return tabkey;
    }
    return 'topology';
  };

  const handleTabChange = (key: string) => {
    // const { match } = props;
    // const url = match.url === '/' ? '' : match.url;
    // const param = location.pathname.replace(`${url}/`, '').split('/')[0]
    const { url, id } = getMatchUrl();
    switch (key) {
      case 'topology':
        history.push(`${url}/${id}/topology`);
        break;
      case 'intentTag':
        history.push(`${url}/${id}/intentTag`);
        break;
      case 'botSetting':
        history.push(`${url}/${id}/botSetting`);
        break;
      default:
        break;
    }
  };

  const getBotData = async () => {
    const { id } = getMatchUrl();
    const res = await getBotList({
      id: id,
    });
    setBotData(res.list[0]);
  };

  useEffect(() => {
    getBotData();
  }, []);

  // const onTab1Change = (key: string) => {
  //     setActiveTabKey(key);
  // };

  // const renderComponent = () => {
  //     switch (activeTabKey) {
  //         case 'mainProcess':
  //             return <TopologyFlow />;
  //         case 'intentTag':
  //             return <IntentTag />;
  //         case 'botSetting':
  //             return <BotSetting />;
  //         default:
  //             return <MainProcess />;
  //     }
  // };

  const renderContent = () => {
    return (
      <Descriptions size="small" title={botData.name} column={5}>
        <Descriptions.Item label="Bot ID">{botData.id}</Descriptions.Item>
        <Descriptions.Item label="Bot 名称">{botData.name}</Descriptions.Item>
        <Descriptions.Item label="行业">
          {transformValToLabel(botData.trade, INDUSTRY)}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          {transformValToLabel(botData.status, BOT_STATUS)}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {moment(botData.updateTime).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  return (
    // <Card
    //   style={{ width: '100%' }}
    //   title="Bot管理"
    //   tabList={tabList}
    //   activeTabKey={activeTabKey}
    //   onTabChange={(key) => {
    //     onTab1Change(key);
    //   }}
    // >
    //   {renderComponent()}
    // </Card>
    <PageContainer
      className="main-process-wrapper"
      content={renderContent()}
      title={false}
      breadcrumbRender={false}
      tabList={tabList}
      tabProps={{ tabBarStyle: { fontSize: '12px', borderBottom: '1px soild #ccc' } }}
      tabActiveKey={getTabKey()}
      onTabChange={handleTabChange}
      // footer={
      //     getTabKey() === 'topology'
      //         ? [
      //             <Button key="submit" type="primary" onClick={saveProcess}>
      //                 保存
      //             </Button>,
      //         ]
      //         : []
      // }
    >
      {props.children}
      {/* {renderComponent()} */}
    </PageContainer>
  );
};

export default MainProcess;
