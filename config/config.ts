// https://umijs.org/config/
import { defineConfig } from 'umi';
// import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: false,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  //   locale: {
  //     // default zh-CN
  //     default: 'zh-CN',
  //     // antd: true,
  //     // default true, when it is true, will use `navigator.language` overwrite default
  //     baseNavigator: true,
  //   },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  //   targets: {
  //     ie: 11,
  //   },
  routes,
  //   access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'variable',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  //   esbuild: {},
  title: '恰音',
  //   ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  base: './',
  // Fast Refresh 热更新
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
