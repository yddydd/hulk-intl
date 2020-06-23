/**
 * @file 业务单元入口
 * @author picheng@sensorsdata.cn
 */

import { create as createModel } from './models';
import { create as createComponent } from './components';

// 业务单元默认命名空间
const namespace = 'miniAPPTemplate';

export default {
  /**
   * 创建业务单元
   *
   * @param {Object} config 业务单元配置
   */
  create(config) {
    return {
      model: createModel({
        namespace,
        ...config
      }),
      route: createComponent(config)
    };
  }
};
