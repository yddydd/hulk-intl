# 业务单元开发标准模板

基于[《以业务单元为粒度的前端开发模式》](http://fe.sensorsdata.cn/wiki/tech/miniapp.html)的总体设计，前端应用开发以业务单元为粒度进行开发、迭代，此项目为业务单元的标准模板。

## 业务单元开发流程

### 1. 新建仓库

在业务单元库 `http://gitlab.internal.sensorsdata.cn/mini-apps` 中创建代码仓库，根据业务模块的具体内容进行命名。

### 2. 添加标准模板

复制此项目的所有文件到新建的业务单元仓库中，在 `package.json` 中修改项目的基本信息，`name` 值必须加命名空间 `sensorsdata`，如：`@sensorsdata/user-group`。

### 3. 写 README

在 README 中描述业务单元的安装、使用方式，具体业务逻辑、依赖的服务端 API 以及版本。

示例：

```markdown
# 用户分群列表业务单元

类型：`基于路由的业务单元`，业务逻辑包括：分群列表、创建分群、编辑分群。

## 安装

npm:

``shell
$ npm install --save git+http://gitlab.internal.sensorsdata.cn/mini-apps/user-group-list.git#semver:~1.0
``

版本依赖锁定到二位版本。

## 使用

``javascript
// APP 运行环境
import sensorsdata from 'sensorsdata';

// 用户分群业务单元
import userGroupList from '@sensorsdata/user-group-list';

// 注册业务单元到运行环境
sensorsdata.register(userGroupList, {
  // 设置业务单元 model 的命名空间
  namespace: 'userGroupList',
  // 设置业务单元路由的根 URL
  basename: '/user-group',
  // 设置业务单元的自定义配置
  options: {
    // 用户列表业务单元路径
    usersPath: '/user-analytics/users/'
  }
});
``

| 配置项 | 描述 |
| :-- | :-- |
| usersPath | 设置用户列表的 `pathname`，交互流程中有跳转到用户列表的入口，未设置则不显示相关入口 |

## 依赖

- 其他业务单元：`global`
```

### 4. 开发

#### 目录结构

```
.
├── src                         # 项目源码目录
│   ├── index.js                # 业务单元入口
│   ├── services.js             # 服务端 API 请求逻辑的封装
│   └── components              # 业务组件目录
│   |   ├── index.js            # 组件入口文件，对外输出的路由组件或普通容器组件
│   |   ├── Header
│   |   │   ├── index.js
│   |   │   └── index.less
│   |   └── Content
│   |       ├── index.js
│   |       └── index.less
│   └── models                  # 业务单元 model
│       └── index.js
├── demo                        # 业务单元演示目录
│   ├── index.ejs
│   └── index.js
├── scripts                     # 业务单元 集成打包 CI 脚本
│   ├── test_with_sa.sh         # 本地集成父级应用编译（需要有父级应用 pull 权限）
│   ├── build_with_sa.sh        # CI 集成测试打包
│   ├── deploy_to_debug.sh      # CI 部署测试环境 （可选）    
│   └── publish_to_npm.sh       # CI 发布包到 registry
├── webpack.config.js           # 业务单元演示代码编译配置
├── package.json
├── .gitlab-ci.yml              # CI 配置
└── README.md

```

#### 业务单元入口 `index.js`

必须提供 `create` 方法，用于接收业务单元配置和业务单元运行环境，返回业务单元的 `model`、`component`。

```javascript
/**
 * @file 业务单元入口
 */

import { create as createModel } from './models';
import { create as createComponent } from './components';

// 业务单元默认命名空间
export const namespace = "userGroupList";

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
```

#### 业务单元 models

业务单元可以有一个或多个 `model`，`models/index.js` 必须提供 `create` 方法，用于接收业务单元配置和业务单元运行环境，返回[基于 `dva` 约定的 `model`](https://dvajs.com/api/#model)。

```javascript
/**
 * @file 业务单元数据层
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

    state: {},

    effects: {},

    reducers: {}
  };
}
```

```javascript
/**
 * @file 业务单元数据层 - 多个 model
 */

// 成员管理列表 model
import { create as createAccountList } from './accountList';
// 成员详情 model
import { create as createAccountDetail } from './accountDetail';

/**
 * 创建业务单元 model
 *
 * @param {Object} config 业务单元配置
 */
export function create(config) {
  return [
    createAccountList(config),
    createAccountDetail(config)
  ];
}
```

##### 标识业务模块的 `ready` 状态

路由业务单元的 model 必须包含一个名为 `ready` 的 action，主要用于埋点、用户行为记录等中间件来捕获不同业务模块的 ready 时机。

ready 时机通常为当前业务可用时，由各个业务单元视自身逻辑而定，如：

```javascript
/**
 * 概览业务单元 model
 * @param {Object} config 业务单元配置
 */
export function create(config) {
  return {
    namespace: config.namespace,

    state: {},

    effects: {
      *init({ search }, { put }) {
        // 当前概览页依赖的服务端数据请求完毕，已触发相关的 reducer

        // 概览页 ready
        yield put({
          type: 'ready',
          pageInfo: {
            id: 123,
            title: '实时统计',
            type: 'lego'
          }
        });
      }
    },

    reducers: {
      ready(state, { pageInfo }) {
        return {
          ...state,
          pageInfo
        };
      }
    }
  };
}
```

发起 `ready` action 时需要传递当前业务的关键信息，如：

* 概览业务单元：概览 id、概览标题
* 用户详情业务单元：用户 id、用户名称

#### 业务单元组件

`component/index.js` 必须提供 `create` 方法，用于接收业务单元配置返回对外输出的组件。

```javascript
/**
 * @file 业务单元入口组件
 */

import React from "react";
import Header from "./Header";
import Content from "./Content";
import style from "./index.less";

/**
 * 创建业务单元对外输出的组件
 *
 * @param {Object} config 业务单元配置
 */
export function create(config) {
  const component = class UserGroupList extends React.Component {
    render() {
      return (
        <div className={style.container}>
          <Header />
          <Content />
        </div>
      );
    }
  };
  return {
    // 路由组件默认 path
    path: `${config.basename || ''}(/?)`,
    component
  }
}
```

#### 演示

在 `demo` 目录中编写演示代码。

> 皮成，2019.07.01
