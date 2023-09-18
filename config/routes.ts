export default [
  {
    path: '/login',
    layout: false,
    component: './login'
  },
  {
    name: '主流程',
    icon: 'table',
    path: '/',
    exact: true,
    routes: [
      // {
      //   name: '主流程',
      //   path: '/',
      //   hideInMenu: true,
      //   redirect: '/botManage',
      // },
      {
        name: 'bot管理',
        // icon: 'table',
        path: '/botManage',
        component: './botManage/bot',
      },
      {
        name: '话术',
        path: '/process',
        hideInMenu: true,
        menuRender: false,
        component: './botManage/mainProcess',
        routes: [
          {
            path: '/process/:id',
            redirect: '/process/:id/topology',
          },
          {
            name: '话术流程',
            path: '/process/:id/topology',
            component: './botManage/topology',
            hideInMenu: true,
            // menuRender: false
          },
          {
            name: '意向标签',
            path: '/process/:id/intentTag',
            component: './botManage/intentTag',
            hideInMenu: true,
            // menuRender: false
          },
          {
            name: 'Bot设置',
            path: '/process/:id/botSetting',
            component: './botManage/botSetting',
            hideInMenu: true,
            // menuRender: false
          },
          {
            name: '录音',
            path: '/process/:id/record',
            component: './botManage/record',
            hideInMenu: true,
          },
          {
            name: '审核',
            path: '/process/:id/review',
            component: './botManage/review',
            hideInMenu: true,
          },
        ],
      },
      //   {
      //     name: '话术流程管理',
      //     path: '/botManage/mainProcess',
      //     component: './botManage/mainProcess',
      //     hideInMenu: true,
      //     menuRender: false,
      //   },
    ],
  },
  {
    name: '任务中心',
    icon: 'table',
    path: '/taskCenter',
    routes: [
      // {
      //   name: '任务中心',
      //   path: '/taskCenter',
      //   hideInMenu: true,
      //   redirect: '/taskCenter/center',
      // },
      {
        name: '智能外呼任务',
        path: '/taskCenter/new',
        component: './taskCenter/index',
      }
    ]
  },
  {
    component: './404',
  },
];
