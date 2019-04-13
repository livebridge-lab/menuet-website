---
id: authentication
title: 认证
sidebar_label: 认证
---

认证即对用户提供的凭证或访问令牌进行鉴定的过程。常用认证方式有两种：基于 Token 和 基于 Session，本项目采用基于 Token 的认证方式。

##### 基本概念
- 身份凭证（Credential）：用于证明用户身份的信息，通常为用户名及登录密码，也可以是证书、指纹。
- 认证（Authentication）：对用户提供的凭证或访问令牌进行鉴定的过程。
- 授权（Authorization）：认证成功后系统对用户是否能对指定资源执行指定操作的权限控制。
- 访问令牌（Access Token）：完成认证授权后，用户每次请求操作服务器资源都应携带服务器发放的访问令牌，以使服务器确定用户身份及权限。

## Token vs Session
两种方式的核心区别在于存储于客户端的 Session ID 不是自解释的，从而导致服务器端必须持续存储 Session 数据。即 Session 认证方案是重服务器端方案，Token 方式则是将存储压力分散到客户端。

|比较项目|Token 认证|Session 认证|
|:---|:---|:---|
|资源消耗|服务器 CPU 资源消耗（将存储空间的消耗分散到客户端）|服务器 CPU 及内存资源消耗（用于实现 Session 的存储、查询、反序列化及回收）|
|<nobr>水平扩展能力</nobr>|自解释，有效性不依赖于访问的服务器进程|认证信息被保存在服务器端，当使用集群化部署时，如果使用 Session 粘滞（即根据 IP 地址的哈希值将用户请求转发到特定的服务器进程）则会影响负载均衡的效果，不便于系统的水平扩展，否则，必须使用 Session 共享机制（如 [Memcached](http://memcached.org/)）|
|高并发能力|Token 存储于客户端，服务器内存占用率不会随着用户并发数量增加而增加|Session 在服务器端内存中是长期贮存的，用户并发数量较大则会消耗大量服务器内存;较短的 Session 生命期将会导致频繁地要求用户登录认证，影响用户使用体验|

## JSON Web Token
本项目采用 JWT（[JSON Web Token](https://jwt.io/introduction/)、[RFC 7519](https://tools.ietf.org/html/rfc7519)） 作为基于 Token 认证的解决方案。JWT 有如下特点：
- 安全性：使用 HMAC 或 RSA 算法加密。
- 小型：基于 JSON 格式数据（相较于 XML 等格式的数据体积小，且易于解释）。
- 自解释：可以包含所有必要信息，描述自我的有效性，从而在完成签名后无需再次查询数据库。

### Token 的组成
Token 由 Header、Payload、Signature 三部分组成，用点号进行链接。如：
```javascript
xxxxx.yyyyy.zzzzz
```


### 基于 JWT 的认证流程：
1. 用户提供凭证向服务器申请授权。
2. 服务器验证用户凭证，并在有效时取得用户信息。
3. 对用户信息中的必要信息（如用户 ID、姓名、角色等）进行签名，生成 JWT 令牌，并返回给客户端。
4. 客户端将服务器返回的令牌保存到 Cookie 或本地存储中，并在后续请求中携带。
5. 用户发起操作服务器资源的请求，服务器对令牌进行校验、解析，并根据解析得到的数据判断用户的权限。

### 注意事项

#### 勿将非必要信息保存于 JWT 中
虽然 JWT 不会占用服务器内存，但是将大量数据存储于 JWT 可能会导致 HTTP 请求的数据体积变大，从而阻塞网络。
#### 勿将 JWT 用作 Session
JWT 的设计目的主要包含两方面，一是用作身份认证，一是用作数据交换。使用 JWT 作为 Session（保存状态数据）将导致服务器频繁的对数据进行签名（增加 CPU 资源开销），以及向客户端返回超大令牌数据（增加网络带宽开销）。


## 实践中的需求
以上介绍的 JWT 的基本内容，在实际的项目中，根据需求还要进行改进调整。

### 服务端废除令牌（踢出）
由于 JWT 具有自解释性，令牌一旦发行如果在有效期内服务端是无法对其无效化的。但是实际项目中要求服务端要具备将非法正在登录的用户踢出的能力。比如监控发现某用户正在发布非法图片，服务端需要马上废除这个用户的令牌。

##### 解决方案
- 对令牌进行数字签名时，生成一个令牌 ID，将其 保存到令牌和数据库中；数据库中存储数据的目的仅是验证其有效性，无需存储 JWT 装载的数据。
- 用户令牌校验时在数据库中查询是否存在，不存即视为令牌已无效。
- 通过管理端删除数据库中的令牌 ID 达到废止令牌的目的。
- 为了减少数据库的压力，采用缓存数据库（Redis）缓存令牌 ID来提高短时间内连续访问服务器时服务器端检查令牌存在性的效率。缓存数据库中记录的生命期可以设置为较短的时长（如 10 秒钟）。

### 用户信息更新同步
如果用户信息被更新，那么已配发给客户端的令牌也需要及时更新。
##### 解决方案
- 令牌携带创建时间，并且在持久化数据和缓存中记录用户信息的最后更新时间。
- 当用户信息被更新时，及时更新用户所有令牌中的用户信息的最后更新时间。
- 服务器在发现客户端使用的令牌的创建时间早于用户最后更新时间时，应重新取得用户信息，对令牌重新进行数字签名，并将新的令牌返回给客户端。


## 设计与实现

#### 数据结构
- JWT 令牌装载数据（payload）的数据结构
    ```javascript
    {
        tid:  String, // 令牌 ID
        ts:   Number, // 创建时间戳（自 1970-01-01 00:00:00.000 的毫秒数）
        uid:  String, // 用户 ID
        name: String, // 用户名称
        role: String  // 用户角色
    }
    ```
- 持久化数据（MongoDB）令牌记录数据结构
    ```javascript
    {
        id:       String, // 令牌 ID
        userId:   String, // 所有者用户 ID
        createAt: Date,   // 创建时间
        renewAt:  Date,   // 用户信息最后更新时间
        expireAt: Date    // 令牌过期时间
    }
    ```
- 缓存（Redis）令牌记录存储内容
    ```javascript
    access-token:<令牌 ID>
    用户信息最后更新时间戳（自 1970-01-01 00:00:00.000 的毫秒数）
    ```

#### 认证流程（登录）

![登录认证流程](./assets/images/authorization-workflow.png)

#### 认证流程（鉴权）

![权限鉴定流程](./assets/images/authentication-workflow.png)

### 代码示例

- 用户登录认证，生成访问令牌：
    ```javascript
    const UserModel = require('mongoose').model('User');
    const sha256 = require('../utils/crypto').sha256;
    const promisify = require('util').promisify;
    const jwt = require('jsonwebtoken');
    const signJWT = promisify(jwt.sign);

    /**
     * 用户登录。
     * @param {object} req - HTTP 请求
     * @param {object} res - HTTP 响应
     * @returns {Promise.<void>}
     */
    exports.login = async function(req, res) {

      // 取得用户信息
      let user = await UserModel.findOne({
        username: req.body.username,
        password: sha256(`${req.body.username}:${req.body.password}`)
      });

      if (!user) {
        throw new Error('用户名或密码不正确');
      }

      // 生成一个有效期为七天的访问令牌
      let token = await signJWT(
        {
          id: user.id,
          name: user.name,
          role: user.role
        },
        'privateKey',
        { expiresIn: '7d' }
      );

      // 将令牌返回给客户端
      res.json({
        success: true,
        data: token
      });

    };
    ```
### 客户端发送请求

```javascript
$.ajax({
    method: 'DELETE',
    url: '/comments/8587',
    headers: { Authorization: 'Bearer ' + jwt }, // 在请求头中设置访问令牌
    success: function(data) {
    // ...
    }
});
```
### 访问令牌校验

```javascript
const CommentModel = require('mongoose').model('Comment');
const promisify = require('util').promisify;
const jwt = require('jsonwebtoken');
const verifyJWT = promisify(jwt.verify);

/**
 * 删除评论。
 * @param {object} req - HTTP 请求
 * @param {object} res - HTTP 响应
 * @returns {Promise.<void>}
 */
exports.remove = async function(req, res) {

    let user = verifyJWT(
    (req.headers['authorization'] || '').replace(/^Bearer (.+?)$/, '$1'),
    'privateKey'
    );

    if (user.role !== 'admin') {
    throw new Error('无权执行此操作');
    }

    await CommentModel.remove({ id: req.params['commentId'] });

    res.json({ success: true });
};
```
