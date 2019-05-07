---
id: intro
title: 开始使用
---

Menuet Web 应用开发框架旨在提高 Web 应用开发效率，规范项目开发流程。

Menuet 基于 [proding.net](https://proding.net/spec/backend) 的设计规范实现。

Menuet Web 应用开发框架具有以下特点：

- 自动实现业务分层：将各业务分层的模块的定义文件置于相应的路径下即可；
- 模块间调用通过注入的方式实现：如果模块A的业务逻辑依赖于模块B，那么只需将模块B的名称作为模块A定义函数的参数（即依赖注入），模块A即可调用模块B；
- 规范了模块之间的调用关系：例如只可向服务层的模块注入工具模块和数据模型，服务模块不可依赖其他服务；
- 使用 JSON Schema 对请求数据及响应数据进行校验；
- 可根据路由定义及 JSON Schema 定义自动生成 API 文档。

运行 Menuet Web 应用开发框架需要 Node.js v7.0.0 或以上版本。

## 配置依赖模块

使用 Menuet Web 应用开发框架前需要在工程的 `package.json` 文件的 `dependencies` 字段中添加 `menuet` 模块的依赖。

```json
{
  "dependencies": {
    "menuet": "*"
  }
}
```

安装依赖包后即可使用 `menuet` 初始化工程。

```shell
$ npm install
```

## 初始化工程

在 `package.json` 中添加以下脚本：

```json
{
  "scripts": {
    "init": "menuet-init"
  }
}
```

执行该脚本，Menuet Web 应用开发框架将使用示例工程代码初始化当前工程，本说明文档将以该示例工程展开说明。

```shell
$ npm run init
```

> 注意：初始化后，工程目录下的文件将会被示例工程代码替换，包括 `package.json` 文件。开始正式开发前，请将示例工程的 `package.json` 中的 `init` 脚本配置删除。

## 默认工程结构

```text
/
  ├─ config
  │    ├─ development.json
  │    ├─ production.json
  │    └─ api-docs.json
  ├─ public
  │    └─ **
  ├─ static
  │    └─ **.json
  ├─ views
  │    └─ *.ejs
  ├─ schemas
  │    ├─ **.json
  │    ├─ keywords.js
  │    └─ formats.js
  ├─ utils
  │    └─ *.js
  ├─ models
  │    └─ *.js
  ├─ services
  │    └─ *.js
  ├─ interceptors
  │    └─ *.js
  ├─ controllers
  │    └─ *.js
  ├─ resolvers
  │    ├─ default.js
  │    └─ error.js
  ├─ routes
  │    └─ *.json
  ├─ package.json
  └─ init.js
```

|文件|说明|
|:---|:---|
|`/config/development.json`|开发环境配置文件|
|`/config/production.json`|产品环境配置文件|
|`/config/api-docs.json`|文档生成工具配置文件|
|`/public/**`|静态资源文件|
|`/static/**`|静态化文件|
|`/view/*.ejs`|视图模板文件|
|`/schemas/keywords.js`|自定义 JSON Schema 关键字定义文件，输出一个关键字与关键字定义的 Map，关键字定义请参考[AJV: Defining custom keywords](https://epoberezkin.github.io/ajv/custom.html#reporting-errors-in-custom-keywords)|
|`/schemas/formats.js`|自定义 JSON Schema 格式定义文件，输出一个格式名与格式正则表达式的 Map|
|`/schemas/default-keywords.json`|默认关键字配置|
|`/schemas/**.json`|JSON Schema 定义文件|
|`/utils/*.js`|工具模块定义文件，模块定义及调用方法详见下文|
|`/models/*.js`|数据模型定义文件，数据模型定义及调用方法详见下文|
|`/services/*.js`|服务模块定义文件，服务定义及调用方法详见下文|
|`/interceptors/*.js`|拦截器定义文件，拦截器定义及调用方法详见下文|
|`/controllers/*.js`|控制器定义文件，控制器定义及调用方法详见下文|
|`/resolvers/default.js`|默认请求结果解析器定义文件|
|`/resolvers/error.js`|错误结果解析器定义文件|
|`/routes/*.js`|路由定义文件|
|`/package.json`|包定义文件|
|`/init.js`|工程初始化逻辑定义文件|

> 工程结构可通过设置配置文件的 `paths` 字段更改，详见下文。

## 工程配置文件

请将工程配置文件置于工程的 `/config` 路径下，文件名为运行环境名称，如 `development.json`、`production.json`。

默认配置内容：

```json
{
  "defaults": {
    "language": "en",
    "domain": "127.0.0.1:3000"
  },
  "http": {
    "port": 3000,
    "jsonParser": {
      "limit": "2mb"
    },
    "urlencodedParser": {
      "limit": "2mb",
      "extended": true
    },
    "cookieParser": "secret",
    "allowCrossDomainAccess": true,
    "router": {
      "caseSensitive": true,
      "mergeParams": true,
      "strict": true
    },
    "base": "/"
  },
  "paths": {
    "public": "public",
    "static": "static",
    "views": "views",
    "strings": "public/assets/strings",
    "schemas": "schemas",
    "utils": "utils",
    "models": "models",
    "services": "services",
    "interceptors": "interceptors",
    "controllers": "controllers",
    "defaultResolver": "resolvers/default.js",
    "errorResolver": "resolvers/error.js",
    "routes": "routes",
    "init": "init.js"
  }
}
```

|字段|说明|可选值/备注|
|:---|:---|:---|
|`defaults.language`|默认语言|`en`、`zh-cn` 等|
|`defaults.domain`|域名|&nbsp;|
|`http.port`|HTTP 服务端口|&nbsp;|
|`http.jsonParser`|JSON 解析中间件配置参数|[参考链接：bodyParser.json([options])](https://github.com/expressjs/body-parser#bodyparserjsonoptions)|
|`http.urlencodedParser`|URL encoded 解析中间件配置参数|[参考链接：bodyParser.urlencoded([options])](https://github.com/expressjs/body-parser#bodyparserurlencodedoptions)|
|`http.cookieParser`|Cookie 解析中间件 secret 参数|&nbsp;|
|`http.allowCrossDomainAccess`|是否允许浏览器跨域访问|&nbsp;|
|`http.router`|Express 路由器配置参数|[参考链接：express.Router([options])](http://expressjs.com/en/4x/api.html#express.router)|
|`http.base`|API 接口的跟路径|&nbsp;|
|`paths.public`|静态资源保存文件夹路径|&nbsp;|
|`paths.static`|API 响应结果静态化文件保存文件夹路径|&nbsp;|
|`paths.views`|EJS 模板保存文件夹路径|&nbsp;|
|`paths.strings`|多语言字典文件保存文件夹路径|不同语言的字典文件名根据语言名称命名，如 `en.json`、`zh-cn.json` 等|
|`paths.schemas`|请求/响应数据 JSON Schema 文件保存路径，遵循 `JSON Schema Draft-06` 标准|[参考连接：JSON schema](http://json-schema.org/)|
|`paths.utils`|工具模块保存文件夹路径|&nbsp;|
|`paths.models`|MongoDB 数据模型保存文件夹路径|&nbsp;|
|`paths.services`|服务模块保存文件夹路径|&nbsp;|
|`paths.interceptors`|拦截器定义文件保存文件夹路径|&nbsp;|
|`paths.controllers`|控制器定义文件保存文件夹路径|&nbsp;|
|`paths.defaultResolver`|正常结果解析器文件路径|&nbsp;|
|`paths.errorResolver`|错误结果解析器文件路径|&nbsp;|
|`paths.routes`|路由定义文件保存文件夹路径|&nbsp;|
|`paths.init`|工程初始化文件路径|&nbsp;|

使用单实例 MongoDB 时添加以下配置内容：

```json
{
  "mongo": {
    "host": "HOST",
    "port": "PORT",
    "db": "DATABASE_NAME",
    "username": "USERNAME",
    "password": "PASSWORD"
  }
}
```

|字段|说明|可选值/备注|
|:---|:---|:---|
|`mongo.host`|数据库服务器 IP 地址|配置产品环境时应使用内网 IP 地址|
|`mongo.port`|mongod 进程端口，默认：27017|&nbsp;|
|`mongo.db`|数据库名称|&nbsp;|
|`mongo.username`|用户名|&nbsp;|
|`mongo.password`|密码|&nbsp;|

使用 MongoDB 复制集时添加以下配置内容：

```json
{
  "mongo": {
    "hosts": [
      {
        "host": "HOST_1",
        "port": "PORT_1"
      },
      {
        "host": "HOST_n",
        "port": "PORT_n"
      }
    ],
    "replicaSet": "REPLICA_SET_NAME",
    "db": "DATABASE_NAME",
    "username": "USERNAME",
    "password": "PASSWORD"
  }
}
```

|字段|说明|可选值/备注|
|:---|:---|:---|
|`mongo.hosts.host`|数据库服务器 IP 地址|配置产品环境时应使用内网 IP 地址|
|`mongo.hosts.port`|mongod 进程端口，默认：27017|&nbsp;|
|`mongo.replicaSet`|复制集名称|&nbsp;|
|`mongo.db`|数据库名称|&nbsp;|
|`mongo.username`|用户名|&nbsp;|
|`mongo.password`|密码|&nbsp;|

使用 Redis 时添加以下配置内容：

```json
{
  "redis": {
    "host": "HOST",
    "port": "PORT",
    "password": "PASSWORD"
  }
}
```

|字段|说明|可选值/备注|
|:---|:---|:---|
|`redis.host`|数据库服务器 IP 地址|配置产品环境时应使用内网 IP 地址|
|`redis.port`|redis-server 进程端口，默认：6379|&nbsp;|
|`redis.password`|密码|&nbsp;|

可以扩展配置文件的内容以供具体业务使用。

## 模块的业务分层及调用约束

根据业务分层，模块被分为以下几类：

|模块|作用|可调用（注入）的模块|
|:---|:---|:---|
|工具（Utilities）|用于实现与业务无关的功能，如图像压缩处理、数据加密等|工程配置信息、其他工具模块|
|数据模型（Models）|定义实体的数据结构，实现对实体的操作逻辑|工程配置信息、工具模块|
|服务（Services）|实现特定的业务逻辑|工程配置信息、工具模块、数据模型|
|拦截器（Interceptors）|接收到客户端请求并完成路由后执行的处理，如权限检查、上传文件解析等|工程配置信息、工具模块、服务模块|
|控制器（Controllers）|调用不同的服务完成特定的业务处理|工程配置信息、工具模块、服务模块|
|解析器（Resolvers）|对控制器的执行结果进行解析、再组装，并返回给客户端，如 HTTP 状态码设置，错误消息封装等|工程配置信息、工具模块、服务模块|

> 工程配置信息通过 `$config` 参数名注入。


## 应用初始化

在应用启动时如果需要对应用进行初始化（如创建必要路径、创建管理员用户账号等），可以在配置文件的 `paths.init` 字段指定的文件中实现初始化逻辑。

下面的示例实现了应用启动前创建管理员用户账号的逻辑：

```javascript
// /init.js
'use strict';

/**
 * 初始化应用。
 *
 * @param {object} UserService 用户服务
 */
module.exports = async (UserService) => {

  // 创建管理员用户账号
  try {

    await UserService.create({
      name: '管理员',
      type: 'admin',
      username: 'admin',
      password: 'admin'
    });

  } catch (e) {

    if (!(e.name === 'MongoError' && e.code === 11000)) {
      throw e;
    }

  }

};
```

## 启动应用

在工程的 `package.json` 的 `scripts` 字段中添加以下脚本：

```json
{
  "scripts": {
    "start-debug": "NODE_ENV=development menuet",
    "start": "NODE_ENV=production menuet"
  }
}
```

以下示例为使用 PM2 在生产环境启动的脚本设置：

```json
{
  "scripts": {
    "start": "pm2 start ./app.json --env production"
  }
}
```

使用 PM2 时需要配置 `/app.json` 文件（参考链接：[PM2 Application Declararion](http://pm2.keymetrics.io/docs/usage/application-declaration/#attributes-available)）：

```json
{
  "name": "example",
  "script": "menuet",
  "exec_mode": "cluster",
  "instances": 4,
  "watch": false,
  "wait_ready": true,
  "listen_timeout": 5000,
  "max_restarts": 5,
  "kill_timeout": 5000,
  "env": {
    "NODE_ENV": "development"
  },
  "env_production": {
    "NODE_ENV": "production"
  },
  "merge_logs": true,
  "log_date_format": "YY-MM-DD HH:mm:ss",
  "error_file": "../log/example-error.log",
  "out_file": "../log/example-output.log",
  "pid_file": "../log/example.pid"
}
```

以开发模式启动：

```shell
$ npm run start-debug
```

以生产模式启动：

```shell
$ npm run start
```

