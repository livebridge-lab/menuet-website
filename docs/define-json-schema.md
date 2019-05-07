---
id: define-json-schema
title: 定义请求数据及响应数据的数据模式（JSON Schema）
sidebar_label: JSON Schema
---

客户端请求数据（路径参数、查询参数、Body 数据）及服务器返回结果需要通过数据模式校验，若未指定数据模式则相应的数据将被替换为空对象。

本 Web 应用开发框架使用 Node.js 的 NPM 模块 [AJV](https://epoberezkin.github.io/ajv/) 对请求数据及响应数据进行校验，AJV 遵循 [JSON Schema](http://json-schema.org/specification.html) 标准。

默认 Schema（通过 `$schema` 属性设置）为 `http://json-schema.org/draft-07/schema#`。

默认配置下，请将 JSON Schema 定义文件置于工程的 `/schemas` 路径下，路由定义中将通过文件路径引用 JSON Schema 定义（例如 `/schemas/user/user.json` 将通过 `user/user` 引用）。

上述“用户注册”接口的请求数据的数据模式定义示例（`/schemas/user/sign-up-form.json`）：

```json
{
  "$id": "http://example.com/user/sign-up-form",
  "type": "object",
  "required": [
    "username",
    "password"
  ],
  "properties": {
    "name": {
      "description": "姓名",
      "type": "string",
      "format": "name"
    },
    "username": {
      "description": "登录用户名",
      "type": "string",
      "minLength": 3,
      "maxLength": 20,
      "format": "username"
    },
    "password": {
      "description": "登录密码",
      "type": "string",
      "minLength": 8,
      "maxLength": 64
    }
  }
}
```

> 根据以上数据模式定义：
> - 必须设置登录用户名及登录密码；
> - 姓名为字符串，格式必须符合在 `/schemas/formats.js` 中定义的 `name` 的格式；
> - 登录用户名为字符串，格式必须符合在 `/schemas/formats.js` 中定义的 `username` 的格式，且长度必须大于等于 3 且小于等于 20；
> - 登录密码为字符串，长度必须大于等于 8 且小于等于 64。

> 如果请求数据不符合数据模式定义，请求将中止，并将返回数据校验错误给客户端；

> 否则，如果客户端提交了其他字段，这些字段将从请求数据中删除。

可在 `/schemas/default-keywords.json` 中为指定路径下的指定类型字段设置默认关键字，如：

```json
{
  "request/**": {
    "string": {
      "transform": ["trim"]
    }
  }
}
```

> 可用关键字请参考 [AJV Keywords](https://github.com/epoberezkin/ajv-keywords)

> 根据以上默认关键字设置：
> - `/schemnas/request/` 路径下的所有数据模式定义中的字符串类型的字段若未设置 `transform` 关键字，那么其 `transform` 关键字将被设置为 `["trim"]`


