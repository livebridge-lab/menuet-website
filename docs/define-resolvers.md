---
id: define-resolvers
title: 定义解析器（Resolvers）
sidebar_label: 解析器
---

通过定义解析器可以对请求处理器返回的结果进行解析，如 HTTP 状态码设置、错误信息记录、错误处理等。

下面以错误处理为例：

```javascript
// /resolvers/error.js
'use strict';

/**
 * 错误解析器。
 *
 * @param {ServerResponse} res HTTP 响应
 * @param {Error} error 错误信息
 * @param {string} error.statusCode HTTP 状态码
 * @returns {Promise.<object>}
 */
module.exports = async (res, error) => {

  res.statusCode = error.statusCode || 400;

  delete error.statusCode;

  // 当为 JSON schema 校验错误时，格式化返回的错误数据
  if (error.name === 'RequestDataValidationError'
      || error.name === 'ResponseDataValidationError') {

    error.paths = (error.errors || []).map(pathError => {

      let params = pathError.params || {};

      return {
        path: (pathError.dataPath || '').slice(1) || params.missingProperty,
        type: pathError.keyword,
        expected: params.type || params.format || params.pattern,
        limit: params.limit,
        property: params.property
      };

    });

    error.message = '数据校验错误';

    delete error.ajv;
    delete error.validation;
    delete error.errors;

  // 当为 Mongoose 数据模型校验错误时，格式化返回的错误数据
  } else if (error.name === 'ValidationError') {

    error.paths = Object.keys(error.errors).map(pathName => {

      let pathError = error.errors[pathName];

      return {
        path: pathError.path,
        type: pathError.kind
      };

    });

    error.message = '数据校验错误';

    delete error['_message'];
    delete error.errors;
  }

  return { error };
};
```
