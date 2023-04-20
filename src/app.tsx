// import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
// import { SettingDrawer } from '@ant-design/pro-layout';
// import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
// import RightContent from '@/components/RightContent';
// import Footer from '@/components/Footer';
// import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import type { RequestConfig } from 'umi';

// const isDev = process.env.NODE_ENV === 'development';

/** 获取用户信息比较慢的时候会展示一个 loading */
// export const initialStateConfig = {
//     loading: <PageLoading />,
// };

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
// export async function getInitialState(): Promise<{
//     settings?: Partial<LayoutSettings>;
//     loading?: boolean;
// }> {
//     return {
//         settings: defaultSettings,
//     };
// }

import { ConfigProvider } from 'antd';

ConfigProvider.config({
  theme: {
    primaryColor: defaultSettings.primaryColor,
  },
});

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    // rightContentRender: () => <RightContent />,
    disableContentMargin: false,

    // footerRender: () => <Footer />,
    onPageChange: () => {
      // const { location } = history;
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    // childrenRender: (children, props) => {
    //     // if (initialState?.loading) return <PageLoading />;
    //     return (
    //         <>
    //             {children}
    //             {!props.location?.pathname?.includes('/login') && (
    //                 <SettingDrawer
    //                     disableUrlParams
    //                     enableDarkTheme
    //                     settings={initialState?.settings}
    //                     onSettingChange={(settings) => {
    //                         setInitialState((preInitialState) => ({
    //                             ...preInitialState,
    //                             settings,
    //                         }));
    //                     }}
    //                 />
    //             )}
    //         </>
    //     );
    // },
    ...initialState?.settings,
  };
};

// 全局请求
const requestInterceptor = (url: string, options: RequestConfig) => {
  return {
    // url: defaultSettings.baseUrl + url, // 此处可以添加域名前缀
    url: url,
    options: {
      ...options,
      headers: {
        // authorization: 'Bearer',
      },
    },
  };
};

// 全局相应拦截
const responseInterceptor = async (response: Response) => {
  const data = await response.clone().json();
  console.log('返回了======', data);
  if (data.code === 200 && data.success) {
    return data.data;
  }
};

const errorHandler = (error: any) => {
  const { response } = error;
  if (response && response.status) {
    const { status, url } = response;
    console.log(`请求错误 ${status}: ${url}`);
  }
  throw error;
};

export const request: RequestConfig = {
  timeout: 1000,
  errorConfig: {},
  middlewares: [],
  // 异常处理
  errorHandler,
  requestInterceptors: [requestInterceptor],
  responseInterceptors: [responseInterceptor],
};
