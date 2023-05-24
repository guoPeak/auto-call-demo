// import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
// import { SettingDrawer } from '@ant-design/pro-layout';
// import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import RightContent from '@/components/RightContent';
// import Footer from '@/components/Footer';
// import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import { ConfigProvider } from 'antd';
import type { RequestConfig } from 'umi';
import { message } from 'antd';
import { history } from 'umi';
// import { queryCurrentUser } from './services/user';
import { getToken, removeToken } from '@/utils/token';




// const isDev = process.env.NODE_ENV === 'development';

const loginPath = '/login';


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

export async function getInitialState() {
    const token = await getToken();
    return {
      getToken,
      token,
      settings: defaultSettings,
    };
}


ConfigProvider.config({
  theme: {
    primaryColor: defaultSettings.primaryColor,
  },
});

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,

    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      console.log('onPageChange   ===>', initialState, location);
      if (!initialState?.token && location.pathname !== loginPath) {
        history.push(loginPath);
      } else if (initialState?.token && location.pathname === loginPath) { // 已登录到登录页面，重到首页
        history.replace('/');
      }
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
  console.log('requestInterceptor', REACT_APP_ENV);
  return {
    // url: defaultSettings.baseUrl + url, // 此处可以添加域名前缀
    url: REACT_APP_ENV === 'dev' ? url : '/api' + url,
    // url,
    options: {
      ...options,
      headers: {
        // authorization: 'Bearer',
        token: getToken()
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
  } else if (data.code === 401) { // 登录失效，移除token
    removeToken()
    history.push(loginPath);
  } else {
    message.error(data.message);
    return data
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
  timeout: 10000,
  errorConfig: {},
  middlewares: [],
  // 异常处理
  errorHandler,
  requestInterceptors: [requestInterceptor],
  responseInterceptors: [responseInterceptor],
};
