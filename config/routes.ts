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
    routes: [
      {
        name: '主流程',
        icon: 'table',
        path: '/',
        hideInMenu: true,
        redirect: '/botManage',
      },
      {
        name: 'bot管理',
        // icon: 'table',
        path: '/botManage',
        component: './botManage/bot',
        routes: [
          // {
          //     name: '话术',
          //     path: '/botManage/main',
          //     // hideInMenu: true,
          //     // menuRender: false,
          //     component: './botManage/mainProcess',
          //     routes: [
          //         // {
          //         //     path: '/botManage/main',
          //         //     hideInMenu: true,
          //         //     redirect: '/botManage/main/topology',
          //         // },
          //         {
          //             name: '话术流程',
          //             path: '/botManage/main/topology',
          //             component: './botManage/topology',
          //             hideInMenu: true,
          //             // menuRender: false
          //         },
          //         {
          //             name: '意向标签',
          //             path: '/botManage/main/intentTag',
          //             component: './botManage/intentTag',
          //             hideInMenu: true,
          //             // menuRender: false
          //         },
          //         {
          //             name: 'Bot设置',
          //             path: '/botManage/main/botSetting',
          //             component: './botManage/botSetting',
          //             hideInMenu: true,
          //             // menuRender: false
          //         },
          //     ]
          // },
        ],
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
  //   {
  //     name: '主流程',
  //     path: '/mainProcess',
  //     component: './botManage/mainProcess',
  //     hideInMenu: true,
  //     menuRender: false
  //   },
  {
    component: './404',
  },
];
