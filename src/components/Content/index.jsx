/**
 * @file 业务单元内容
 * @author picheng@sensorsdata.cn
 */

import React from 'react';
import style from './index.less';

export default ({ content }) => {
  return (
    <div className={style.content}>
      <h2>系统配置信息</h2>
      <div>
        {content ? (
          <textarea defaultValue={JSON.stringify(content)}></textarea>
        ) : (
          '暂无'
        )}
      </div>
    </div>
  );
};
