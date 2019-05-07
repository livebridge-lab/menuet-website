---
id: define-routes
title: 定义路由（Routes）
sidebar_label: 路由
---

以下为用户业务 API 路由定义的示例（`/routes/user.json`）。

```json
{
  "index": 1,
  "title": "用户业务",
  "routes": [
    {
      "name": "用户注册",
      "method": "post",
      "path": "/users",
      "body": "user/sign-up-form",
      "handler": "user.signUp",
      "response": "user/user"
    },
    {
      "name": "用户登录",
      "method": "post",
      "path": "/authorizations",
      "body": "user/sign-in-form",
      "handler": "user.signIn",
      "response": "user/user"
    },
    {
      "name": "取得用户资料",
      "method": "get",
      "path": "/users/:userId/profile",
      "params": "user/get-params",
      "handler": "user.getProfile",
      "response": "user/user"
    }
  ]
}
```

|字段|数据类型|是否必须|说明|
|:---|:---:|:---:|:---|
|`index`|整数||指定该业务在 API 文档中索引的顺序，未指定该字段时将不会生成相应业务的文档|
|`title`|字符串||业务名称|
|`routes`|对象数组|是|路由定义列表|
|`routes.name`|字符串|是|接口名称|
|`routes.description`|字符串||接口说明|
|`routes.method`|字符串|是|接受的请求方法，可选值：`get`、`post`、`put`、`patch`、`delete`、`options`、`head`|
|`routes.path`|字符串|是|请求路径，参照 [Path examples](http://expressjs.com/en/4x/api.html#path-examples)|
|`routes.params`|字符串||路径参数数据模式定义文件路径|
|`routes.query`|字符串||查询参数数据模式定义文件路径|
|`routes.body`|字符串||请求数据模式定义文件路径|
|`routes.interceptors`|字符串数组或对象数组||请求拦截器名称或拦截器选项，参考下文的“定义拦截器”部分|
|`routes.interceptors.name`|字符串||请求拦截器名称|
|`routes.interceptors.options`|字符串||请求拦截器执行选项|
|`routes.handler`|字符串|是|请求处理器名称，参考上文的“定义控制器”部分|
|`routes.response`|字符串||响应数据模式定义文件路径|
