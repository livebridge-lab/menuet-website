---
id: define-controllers
title: 定义控制器（Controllers）
sidebar_label: 控制器
---

控制器定义模块输出一个对象，该对象的所有方法将作为请求处理器。

请求处理器的第一个参数为上下文（Context）对象，其他参数为注入参数（工具、服务）。

上下文对象的数据结构：

|字段|类型|说明|
|:---|:---|:---|
|`params`|对象|路径参数|
|`query`|对象|查询参数|
|`body`|对象|请求数据|
|`Symbol.for('request')`|对象|HTTP 请求实例|
|`Symbol.for('response')`|对象|HTTP 响应实例|

在路由定义中，通过控制器定义文件名加控制器方法名指定路由的处理器（例如下面的 `signUp` 和 `signIn` 方法可分别通过 `user.signUp` 和 `user.signIn` 指定）。

```javascript
// /controllers/user.js
'use strict';

/**
 * 用户注册。
 *
 * @param {Context} context 上下文实例
 * @param {object} UserService 用户账号服务
 * @returns {Promise.<object>}
 */
exports.signUp = async function(context, UserService) {
  return await UserService.create(context.body);
};

/**
 * 用户登录。
 *
 * @param {Context} context 上下文实例
 * @param {object} UserService 用户账号服务
 * @returns {Promise.<object>}
 */
exports.signIn = async function(context, UserService) {
  return await UserService.authenticate(
    context.body.username,
    context.body.password
  );
};

/**
 * 取得用户账号详细信息。
 *
 * @param {Context} context 上下文实例
 * @param {object} UserService 用户账号服务
 * @returns {Promise.<object>}
 */
exports.getProfile = async function(context, UserService) {
  return await UserService.getProfile(context.params.userId);
};

/**
 * 设置用户头像。
 *
 * @param {Context} context 上下文实例
 * @param {object} UserService 用户账号服务
 * @returns {Promise.<object>}
 */
exports.setAvatar = async function(context, UserService) {
  return await UserService.update(
    context.user._id,
    { avatar: context.body.avatar }
  );
};
```
