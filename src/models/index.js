/**
 * @file 业务单元数据层
 * @author picheng@sensorsdata.cn
 */

import { queryConfig } from '../services';

/**
 * 创建业务单元 model
 *
 * @param {Object} config 业务单元配置
 */
export function create(config) {
  return {
    namespace: config.namespace,

    state: {
      title: '业务单元开发标准模板',
      // 业务单元初始化状态
      ready: false,
      // 系统配置信息
      systemConfig: null
    },

    effects: {
      /**
       * 初始化基础数据
       */
      *init(params, { call, put }) {
        const systemConfig = yield call(queryConfig);
        yield put({
          type: 'initSuccess',
          systemConfig
        });
        yield put({
          type: 'ready',
          pageInfo: {
            id: 123
          }
        });
      }
    },

    reducers: {
      /**
       * 基础数据处理
       * @param {Object} systemConfig 系统配置信息
       */
      initSuccess(state, { systemConfig }) {
        return {
          ...state,
          systemConfig,
          ready: true
        };
      },
      /**
       * 标识页面 ready 时机，主要便于应用全局逻辑捕获
       * @param {object=} pageInfo 页面关键信息
       */
      ready(state, { pageInfo }) {
        return {
          ...state,
          pageInfo
        };
      }
    }
  };
}
