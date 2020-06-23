/**
 * @file 业务单元演示 demo
 * @author picheng@sensorsdata.cn
 */

// 引入 ES2015+ 新增特性的 polyfill
import 'url-polyfill';
import '@babel/polyfill';

// 应用全局的 CSS
import 'antd/dist/antd.less';
import 'theme/theme.less';

// 国际化，在 Webpack 模块化执行的最开始，启动国际化模块
import { setLocale } from '@sc/intl';
import localStorage from '@sc/localstorage';
setLocale({
  locale:
    localStorage.getItem('LOCALE.language') ||
    navigator.language ||
    navigator.browserLanguage ||
    'zh-cn',
  on: true
});

// 基础运行环境
import sensorsdata from 'sensorsdata';

// 业务单元
import global from '@sensorsdata/global';
import passport from '@sensorsdata/passport';
import demo from '../src';

// 根组件
import Root from './Root';
// 运行环境配置
sensorsdata.configure({
  // 配置全局路由组件
  root: Root,
  // 配置扩展程序
  extensions: [
    {
      name: 'DocumentTitle',
      config: {
        // title 格式化方法
        format(title) {
          return `${title}-神策`;
        }
      }
    }
  ],
});

// 注册业务单元到运行环境
sensorsdata.register([
  // 应用基础数据业务单元
  [
    global,
    {
      productName: 'SA',
      isNeedMetadata: true
    }
  ],
  // 应用登录管理业务单元
  passport,
  // 基本设置业务单元
  [
    demo,
    {
      // 设置业务单元 model 的命名空间
      namespace: 'demo',
      // 设置业务单元路由的根 URL
      basename: '/'
    }
  ]
]);

// 启动运行环境
sensorsdata.start();
