---
id: define-models
title: 定义数据模型（Models）
sidebar_label: 数据模型
---

数据模型定义模块输出一个函数（工厂模式），该函数返回一个 [Mongoose 的 Schema](http://mongoosejs.com/docs/guide.html) 实例，框架将使用该 Schema 实例注册一个 [Mongoose 数据模型](http://mongoosejs.com/docs/models.html)。

数据模型的全局名称将为文件名驼峰化加 `Model` 的形式（例如下面例子中的数据模型将被命名为 `UserModel`）。

可以通过数据模型的名称向服务、拦截器、控制器、解析器的定义函数注入数据模型。

```javascript
// /models/user.js
'use strict';

const bcrypt = require('bcrypt');

/**
 * 返回用户实体 Mongoose 数据模式。
 *
 * @returns {mongoose.Schema}
 */
module.exports = (Schema, CryptoUtil) => {

  let userSchema = new Schema(
    {
      // 姓名
      name: String,
      // 头像路径
      avatar: String,
      // 用户账号类型（admin：管理员；user：普通用户）
      type: {
        dataType: String,
        enum: [ 'admin', 'user' ],
        default: 'user'
      },
      // 登录用户名
      username: String,
      // 登录密码
      password: String,
      // 账号创建时间
      createAt: {
        dataType: Date,
        default: Date.now
      }
    },
    {
      collection: 'users',
      typeKey: 'dataType'
    }
  );

  // 定义唯一索引
  userSchema.index({ username: 1 }, { unique: true });

  /**
   * 对登录密码加密。
   *
   * @param {string} password 登录密码
   * @returns {string} 使用 bcrypt 算法加密后的密码
   */
  const encryptPassword = password => {
    return bcrypt.hashSync(CryptoUtil.sha384(password, true), 12);
  };

  // 保存用户登录账号信息前先对登录密码加密
  userSchema.pre('save', function(next) {
    this.set('password', encryptPassword(this.password));
    next();
  });

  /**
   * 校验登录密码。
   *
   * UserModel 的静态方法。
   * @param {string} password 登录密码
   * @param {string} hash 加密后的密码
   * @returns {boolean} 校验是否成功
   */
  userSchema.statics.verifyPassword = (password, hash) => {
    return bcrypt.compareSync(CryptoUtil.sha384(password, true), hash);
  };

  return userSchema;
};

```
