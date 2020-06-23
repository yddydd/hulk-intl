/**
 * @file 应用根组件
 * @author sensorsdata.cn
 */

import React, { useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { IntlContainer } from '@sc/intl';

// 移除写在 HTML 中的 loading 元素
const removeLoading = _.once(() => {
  const loading = document.querySelector('#appLoading');
  if (loading) {
    document.body.removeChild(document.querySelector('#appLoading'));
  }
});

// 初始化 global
const initGlobal = _.once(dispatch => {
  dispatch({
    type: 'global/init'
  });
});

function Root(props) {
  const { global = {}, location, children, dispatch } = props;
  const { ready, historyList = [], intl } = global;
  const isLoginPage = /^\/login/.test(location.pathname);

  // 初始化 global
  useEffect(() => {
    // 登录页不依赖 global
    if (!isLoginPage && !ready) {
      initGlobal(dispatch);
    }
  });

  // 应用初始化完毕后移除写在 HTML 中的 loading 元素
  useEffect(() => {
    // 登录页打开后直接移除
    if (isLoginPage) {
      removeLoading();
      return;
    }
    // 非登录页在 global reday 后移除
    if (ready) {
      removeLoading();
    }
  });

  // 添加 location 记录到 global 中
  useEffect(() => {
    // 与最近一条 location 相同则不重复记
    if (
      !historyList.length ||
      !_.isEqual(historyList[historyList.length - 1], location)
    ) {
      dispatch({
        type: 'global/setHistoryList',
        location
      });
    }
  });

  // 登录页
  if (isLoginPage) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  // 非登录页
  if (ready) {
    return (
      <IntlContainer {...intl}>
        <div id="container" style={{ height: '100%' }}>
          {children}
        </div>
      </IntlContainer>
    );
  }

  return null;
}

export default withRouter(
  connect(({ global }) => {
    return {
      global
    };
  })(Root)
);
