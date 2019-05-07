---
id: define-utilities
title: 定义工具（Utilities）
sidebar_label: 工具
---

工具定义模块输出一个函数（工厂模式），该函数返回一个对象作为工具的实例。

工具模块的全局名称将为文件名驼峰化加 `Util` 的形式（例如下面例子中 `/utils/crypto.js` 生成的模块将被命名为 `CryptoUtil`）。

> 若要自定义模块名称，可以在定义函数上添加 `moduleName` 符号属性，其值即为模块名称（例如下面例子中 `/utils/errors.js` 生成的模块将被命名为 `Errors`）。

可以通过工具模块的名称向数据模型、服务、拦截器、控制器、解析器的定义函数注入工具模块。

```javascript
// /utils/crypto.js
'use strict';

const crypto = require('crypto');

/**
 * 取得指定字符串指定摘要算法的摘要。
 *
 * @param {string} algorithm 摘要算法，如 md5、sha256、sha384、sha512 等
 * @param {string} string 输入字符串
 * @param {boolean} [base64=false] 是否以 base64 格式编码，默认以十六进制形式（hex）编码
 * @param {string} [charset=binary] 字符集，如 ascii、utf8、binary 等
 * @returns {string} 字符串摘要
 */
const digest = (algorithm, string, base64 = false, charset = 'binary') => {

  if (typeof base64 === 'string') {
    charset = base64;
    base64 = false;
  }

  string = (new Buffer(string)).toString(charset);

  return crypto
    .createHash(algorithm)
    .update(string)
    .digest(base64 === true ? 'base64' : 'hex');
};

/**
 * 数据加密工具生成器。
 *
 * @returns {object}
 */
module.exports = () => {

  return {

    /**
     * 生成字符串的 MD5 摘要。
     *
     * @param {string} string 输入字符串
     * @param {boolean} [base64=false] 是否以 base64 格式编码，默认以十六进制形式（hex）编码
     * @param {string} [charset=binary] 字符集，如 ascii、utf8、binary 等
     * @returns {string} 字符串摘要
     */
    md5: (string, base64, charset) => {
      return digest('md5', string, base64, charset);
    },

    /**
     * 生成字符串的 SHA-384 摘要。
     *
     * @param {string} string 输入字符串
     * @param {boolean} [base64=false] 是否以 base64 格式编码，默认以十六进制形式（hex）编码
     * @param {string} [charset=binary] 字符集，如 ascii、utf8、binary 等
     * @returns {string} 字符串摘要
     */
    sha384: (string, base64, charset) => {
      return digest('sha384', string, base64, charset);
    }

  };

};
```

```javascript
// /utils/errors.js
'use strict';

/**
 * 返回错误类。
 *
 * @returns {object}
 */
module.exports = () => {

  /**
   * 登录认证失败错误。
   * @extends {Error}
   */
  class AuthenticationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'AuthenticationError';
      this.statusCode = 401;
    }
  }

  /**
   * 未登录错误。
   * @extends {Error}
   */
  class UnauthorizedError extends Error {
    constructor(message) {
      super(message);
      this.name = 'UnauthorizedError';
      this.statusCode = 401;
    }
  }

  return {
    AuthenticationError,
    UnauthorizedError
  };

};

module.exports[Symbol.for('moduleName')] = 'Errors';
```
