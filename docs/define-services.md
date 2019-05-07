---
id: define-services
title: 定义服务（Services）
sidebar_label: 服务
---

服务定义模块输出一个函数（工厂模式），该函数返回一个对象作为服务的实例。

数据模型的全局名称将为文件名驼峰化加 `Service` 的形式（例如下面例子中的服务将被命名为 `UserService`）。

可以通过服务的名称向拦截器、控制器、解析器的定义函数注入数据模型。

```javascript
// /services/user.js
'use strict';

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-json-web-token-secret';

/**
 * 生成 JSON Web Token。
 *
 * @param {object} payload
 * @returns {Promise.<string>}
 */
const signJWT = payload => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, (e, token) => {
      e ? reject(e) : resolve(token);
    });
  });
};

/**
 * 验证 JSON Web Token。
 *
 * @param {string} token
 * @returns {Promise.<object>}
 */
const verifyJWT = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (e, payload) => {
      e ? reject(e) : resolve(payload);
    });
  });
};

/**
 * 返回用户账号服务实例。
 *
 * @param {function} UserModel 用户账号数据模型
 * @returns {object}
 */
module.exports = (UserModel) => {

  return {

    /**
     * 创建用户账号。
     *
     * @param {object} userInfo 用户信息
     * @param {string} userInfo.name 姓名
     * @param {string} userInfo.type 用户账号类型
     * @param {string} userInfo.username 登录用户名
     * @param {string} userInfo.password 登录密码
     * @returns {Promise.<object>} 返回用户账号信息
     */
    async create(userInfo) {
      return (await (new UserModel(userInfo)).save()).toObject();
    },

    /**
     * 用户登录认证。
     *
     * @param {string} username 登录用户名
     * @param {string} password 登录密码
     * @returns {Promise.<object>} 返回用户账号信息
     */
    async authenticate(username, password) {

      let userDoc = await UserModel
        .findOne({ username: username })
        .lean();

      if (!userDoc || !UserModel.verifyPassword(password, userDoc.password)) {
        throw new Error.AuthenticationError('用户名或密码不正确');
      }

      userDoc.accessToken = await signJWT({
        _id: userDoc._id,
        type: userDoc.type
      });

      return userDoc;
    },

    /**
     * 取得用户账号信息。
     *
     * @returns {Promise.<object>} 返回用户账号信息
     */
    async getProfile(userId) {
      return await UserModel.findOne({ _id: userId }).lean();
    },

    /**
     * 验证访问令牌。
     *
     * @param {string} accessToken
     * @returns {Promise.<object>}
     */
    async verifyAccessToken(accessToken) {
      return await verifyJWT(accessToken);
    },

    /**
     * 更新用户账号信息。
     *
     * @param {string} userId 用户账号 ID
     * @param {object} userData 用户数据
     * @param {string} [userData.avatar] 用户头像
     * @returns {Promise.<void>}
     */
    async update(userId, userData) {

      await UserModel.update(
        { _id: userId },
        { $set: userData },
        { runValidators: true }
      );

    }

  };

};
```
