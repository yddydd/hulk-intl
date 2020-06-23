/**
 * @file 业务单元入口组件
 * @author picheng@sensorsdata.cn
 */

import React, { useEffect } from 'react';
import { connect } from 'dva';
import Header from './Header';
import Content from './Content';
import style from './index.less';

/**
 * 创建业务单元对外输出的组件
 *
 * @param {Object} config 业务单元配置
 */
export function create(config) {
  // 运行环境提供的扩展程序
  const {
    // DocumentTitle 组件 http://gitlab.sensorsdata.cn/mini-apps/sensorsdata/src/extensions/documentTitle
    common: { DocumentTitle }
  } = window.sensorsdata;

  // 路由组件
  const component = connect(state => {
    return {
      ...state[config.namespace]
    };
  })(props => {
    const { ready, title, systemConfig, dispatch } = props;

    // 初始化 model
    useEffect(() => {
      if (!ready) {
        dispatch({
          type: `${config.namespace}/init`
        });
      }
    });

    if (!ready) {
      return null;
    }

    return (
      <DocumentTitle title="标准模板">
        <div className={style.container}>
          <Header title={title} />
          <Content content={systemConfig} />
        </div>
      </DocumentTitle>
    );
  });

  return {
    // 路由组件 path
    path: `${config.basename || ''}(/?)`,
    component
  };
}
