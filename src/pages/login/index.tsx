import {
  // AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  // TaobaoOutlined,
  // UserOutlined,
  // WeiboOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  // ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-form';
// import { Button, Divider, message, Space, Tabs } from 'antd';
// import type { CSSProperties } from 'react';
import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { login } from '@/services/user';
import { setToken } from '@/utils/token';
import { history } from 'umi';
import md5 from 'js-md5'
import loginImg from '@/assets/login-bg.png';


const Login: React.FC = () => {
  // const [loginType, setLoginType] = useState<LoginType>('phone');
  const { setInitialState } = useModel('@@initialState');

  const handleSubmit = (val: any) => {
    console.log('handleSubmit   ====>', val);
    const { phone, password } = val
    login({
      phone,
      password: md5(password),
      zone: '0086'
    }).then( async res => {
      console.log('handleSubmit login  ======> ', res);
      setToken(res.token)
      await setInitialState((s: any) => ({
        ...s,
        token: res.token,
      }));
      history.replace('/')
    })
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        // height: 'calc(100vh - 48px)',
        height: '100vh',
        // margin: -24,
      }}
    >
      <LoginFormPage
        onFinish={handleSubmit}
        // backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
        backgroundImageUrl={loginImg}
        style={{backgroundSize: 'contain'}}
        // logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
        title="恰音科技"
        subTitle=" "
        // activityConfig={{
        //   style: {
        //     boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
        //     color: '#fff',
        //     borderRadius: 8,
        //     backgroundColor: '#1677FF',
        //     backgroundImage: 'url("/static/login-bg.52ffc8ab.png")',
        //   },
        //   title: '活动标题，可配置图片',
        //   subTitle: '活动介绍说明文字',
        // }}
        // actions={
        //   <div
        //     style={{
        //       display: 'flex',
        //       justifyContent: 'center',
        //       alignItems: 'center',
        //       flexDirection: 'column',
        //     }}
        //   >
        //     <Divider plain>
        //       <span
        //         style={{ color: '#CCC', fontWeight: 'normal', fontSize: 14 }}
        //       >
        //         其他登录方式
        //       </span>
        //     </Divider>
        //     <Space align="center" size={24}>
        //       <div
        //         style={{
        //           display: 'flex',
        //           justifyContent: 'center',
        //           alignItems: 'center',
        //           flexDirection: 'column',
        //           height: 40,
        //           width: 40,
        //           border: '1px solid #D4D8DD',
        //           borderRadius: '50%',
        //         }}
        //       >
        //         <AlipayOutlined style={{ ...iconStyles, color: '#1677FF' }} />
        //       </div>
        //       <div
        //         style={{
        //           display: 'flex',
        //           justifyContent: 'center',
        //           alignItems: 'center',
        //           flexDirection: 'column',
        //           height: 40,
        //           width: 40,
        //           border: '1px solid #D4D8DD',
        //           borderRadius: '50%',
        //         }}
        //       >
        //         <TaobaoOutlined style={{ ...iconStyles, color: '#FF6A10' }} />
        //       </div>
        //       <div
        //         style={{
        //           display: 'flex',
        //           justifyContent: 'center',
        //           alignItems: 'center',
        //           flexDirection: 'column',
        //           height: 40,
        //           width: 40,
        //           border: '1px solid #D4D8DD',
        //           borderRadius: '50%',
        //         }}
        //       >
        //         <WeiboOutlined style={{ ...iconStyles, color: '#333333' }} />
        //       </div>
        //     </Space>
        //   </div>
        // }
      >
        {/* <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
          <Tabs.TabPane key={'phone'} tab={'手机号登录'} />
        </Tabs> */}
        {/* {loginType === 'account' && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              placeholder={'用户名: admin or user'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'密码: ant.design'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </>
        )} */}
        {/* {loginType === 'phone' && ( */}
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileOutlined className={'prefixIcon'} />,
              }}
              name="phone"
              placeholder={'手机号'}
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]}
              initialValue={16621057784}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
              initialValue={'chatyin123'}
            />
            {/* <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'获取验证码'}`;
                }
                return '获取验证码';
              }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
              onGetCaptcha={async () => {
                message.success('获取验证码成功！验证码为：1234');
              }}
            /> */}
          </>
        {/* )} */}
        <div style={{ marginBlockEnd: 24 }}>
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a style={{ float: 'right' }}>
            忘记密码
          </a>
        </div>
      </LoginFormPage>
    </div>
  );
};

export default Login