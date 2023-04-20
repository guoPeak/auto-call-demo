import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  baseUrl?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  //   primaryColor: '#1890ff',
  primaryColor: '#1B1E83',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'hello world',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
  baseUrl: 'http://124.221.115.161:8661',
};

export default Settings;
