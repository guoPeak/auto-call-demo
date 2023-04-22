export default [
  {
    name: '主流程',
    icon: 'table',
    path: '/',
    // redirect: '/botManage',
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
        // routes: [
        //     {
        //         name: '话术',
        //         path: '/bot/:id',
        //         hideInMenu: true,
        //         menuRender: false,
        //         component: './botManage/mainProcess',
        //         routes: [
        //             {
        //                 name: '话术流程',
        //                 path: '/botManage/:id/topology',
        //                 component: './botManage/topology',
        //                 hideInMenu: true,
        //                 menuRender: false
        //             },
        //             {
        //                 name: '意向标签',
        //                 path: '/botManage/:id/intentTag',
        //                 component: './botManage/intentTag',
        //                 hideInMenu: true,
        //                 menuRender: false
        //             },
        //             {
        //                 name: 'Bot设置',
        //                 path: '/botManage/:id/botSetting',
        //                 component: './botManage/botSetting',
        //                 hideInMenu: true,
        //                 menuRender: false
        //             },
        //         ]
        //     },
        // ]
      },
      {
        name: '主流程',
        path: '/botManage/mainProcess',
        component: './botManage/mainProcess',
        hideInMenu: true,
        menuRender: false,
      },
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
