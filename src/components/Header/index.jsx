/**
 * @file 业务单元头部
 * @author picheng@sensorsdata.cn
 */

import React from 'react';
import style from './index.less';

export default ({ title }) => {
  return (
    <div className={style.header}>
      <h1>{title}</h1>
    </div>
  );
};
