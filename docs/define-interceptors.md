---
id: define-interceptors
title: 定义拦截器（Interceptors）
sidebar_label: 拦截器
---

可以通过在路由定义中添加拦截器设置实现在执行业务处理前执行如访问令牌校验、权限检查、上传文件接收等处理。

下面以设置用户头像为例。

首先定义两个拦截器，分别用于校验访问令牌和接收上传的头像文件数据：

> 拦截器的前两个参数 `req` 和 `options` 是固定传入的参数，其他参数通过名称注入工程配置数据、已定义的工具或服务。

> 将从访问令牌解析得到的用户信息以符号 `x-user-info` 设置到请求数据中后，框架将会从请求数据中取得用户信息并可在控制器中通过 `context.user` 取得用户信息。

```javascript
// /interceptors/verify-access-token.js
'use strict';

const USER_INFO = Symbol.for('x-user-info');

/**
 * 检查访问令牌是否有效。
 * 访问令牌通过 Authorization 请求头传递，格式为“Bearer 访问令牌”。
 *
 * @see https://jwt.io/introduction/
 * @param {IncomingMessage} req HTTP 请求
 * @param {object} options 拦截器配置参数
 * @param {object} Errors 错误类定义命名空间
 * @param {object} UserService 用户服务
 * @returns {object} 访问令牌中的用户信息
 */
module.exports = async (req, options, Errors, UserService) => {

  let accessToken = ((req.get('authorization') || '').match(/^Bearer (.+)$/) || [])[1];

  if (!accessToken) {
    throw new Errors.UnauthorizedError('尚未登录');
  }

  req[USER_INFO] = await UserService.verifyAccessToken(accessToken);
};
```

> 上传文件接收拦截器使用 [`multer`](https://github.com/expressjs/multer) 模块解析 HTTP 请求中的文件数据。

```javascript
// /interceptors/upload-image.js
'use strict';

const promisify = require('util').promisify;
const multer = require('multer');
const path = require('path');
const moment = require('moment');

/**
 * 接收上传的文件。
 *
 * @param {IncomingMessage} req HTTP 请求实例
 * @param {object} options 拦截器执行选项
 * @param {string} options.fieldName 文件字段名
 * @param {number} options.maxSize 接受的最大文件大小
 * @param {string} options.mimeType 接受的文件媒体类型的正则表达式
 */
module.exports = async (req, options) => {

  const uploadFile = promisify(multer({
    storage: multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, path.join(process.env.PWD, 'public/files'));
      },
      filename: (req, file, callback) => {
        callback(null, moment().format('YYYYMMDDHHmmss') + path.extname(file.originalname));
      }
    }),
    limits: {
      fieldSize: options.maxSize,
      files: 1
    },
    fileFilter: (req, file, callback) => {

      if (!(new RegExp(options.mimeType, 'i')).test(file.mimetype)) {
        return callback(new Error('文件类型不正确'));
      }

      callback(null, true);
    },
    preservePath: true
  }).single(options.fieldName));

  await uploadFile(req, req.res);

  if (!req.file) {
    req.body[options.fieldName] = null;
    return;
  }

  req.body[options.fieldName] = path.join(
    '/',
    path.relative(
      path.join(process.env.PWD, 'public'),
      req.file.path
    )
  );

};
```

定义请求数据的数据模式（`/schemas/user/set-avatar-form.json`）：

```json
{
  "$id": "http://example.com/user/set-avatar-form",
  "type": "object",
  "required": [
    "avatar"
  ],
  "properties": {
    "avatar": {
      "description": "头像文件路径",
      "type": "string"
    }
  }
}
```

路由配置：

> 通过以下配置，客户端调用 `/user/avatar` 接口时必须将有效的用户令牌设置到 `Authorization` 请求头中。

```json
{
  "index": 1,
  "title": "用户业务",
  "routes": [
    {
      "name": "设置登录用户头像",
      "method": "put",
      "path": "/user/avatar",
      "interceptors": [
        "verify-access-token",
        {
          "name": "upload-image",
          "options": {
            "fieldName": "avatar",
            "maxSize": 2097152,
            "mimeType": "^image\\/(jpeg|png|gif)$"
          }
        }
      ],
      "body": "user/set-avatar-form",
      "handler": "user.setAvatar"
    }
  ]
}
```
