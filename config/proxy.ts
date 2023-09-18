/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/sales/': {
        // 要代理的地址
      target: 'http://39a0c08f.r15.cpolar.top',
      // 配置了这个可以从 http 代理到 https
      // 依赖 origin 的功能可能需要这个，比如 cookie
      changeOrigin: true,
      pathRewrite: { '': '' },
    }
    // '/api/': {
    //   // 要代理的地址
    //   target: 'http://124.221.115.161:80',
    //   // 配置了这个可以从 http 代理到 https
    //   // 依赖 origin 的功能可能需要这个，比如 cookie
    //   changeOrigin: true,
    //   pathRewrite: { '': '' },
    // },
    // '/branch/': {
    //     target: 'http://124.221.115.161:80',
    //     changeOrigin: true,
    //     pathRewrite: { '': '' },
    // },

    // '/salesTalk/': {
    //     target: 'http://124.221.115.161:80',
    //     changeOrigin: true,
    //     pathRewrite: { '': '' },
    // },

    // '/audit/': {
    //     target: 'http://124.221.115.161:80',
    //     changeOrigin: true,
    //     pathRewrite: { '': '' },
    // },

    // '/auth/': {
    //   target: 'http://47.101.146.200:8663',
    //   changeOrigin: true,
    //   pathRewrite: { '': '' },
    // },
    // '/file/': {
    //   target: 'http://124.221.115.161:80',
    //   changeOrigin: true,
    //   pathRewrite: { '': '' },
    // },

    // '/service/': {
    //   target: 'http://124.221.115.161:80',
    //   changeOrigin: true,
    //   pathRewrite: { '': '' },
    // },

  },
//   test: {
//     '/branch/getDefaultBranch': {
//       target: 'http://124.221.115.161:8661/branch/getDefaultBranch',
//       changeOrigin: true,
//       pathRewrite: { '^': '' },
//     },
//   },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
