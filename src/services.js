/**
 * @file 服务端 API
 * @author picheng@sensorsdata.cn
 */

/*
 * 服务端 API 请求方法
 * @see http://gitlab.sensorsdata.cn/mini-apps/sensorsdata/src/extensions/request
 */
const {
  common: { request }
} = window.sensorsdata;

/**
 * 查询系统配置信息
 */
export async function queryConfig() {
  return request('/api/config');
}
