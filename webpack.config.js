/**
 * @file Webpack 配置
 * @author picheng@sensorsdata.cn
 */

const createWebpackConfig = require('@sensorsdata/create-webpack-config');

/**
 * 判断开发环境和生产环境作配置上的区分
 */
const isProduction = process.env.NODE_ENV === 'production';

/**
 * 基础 URL 路径
 */
const DEPLOY_PATH = process.env.DEPLOY_PATH || '';

module.exports = createWebpackConfig(__dirname, {
  isProduction,
  entry: './demo/index.js',
  template: './demo/index.ejs',
  globalConstants: {
    // 基础 URL 路径
    'process.env.DEPLOY_PATH': '"' + DEPLOY_PATH + '"'
  },
  port: 8000,
  proxy: {
    '/api/': 'http://10.42.105.184:8107/'
  }
});
