---
id: build-api-docs
title: 生成 API 文档
---

通过在 `package.json` 文件中添加脚本执行 `menuet-docs` 命令，可以根据路由定义生成 API 文档。

`menuet-docs` 命令接受以下参数：

- `--lang`：文档语言，如 `en`、`zh-cn`
- `--config`：文档配置文件路径，如 `config/api-docs.json`
- `--output`：文档输出路径，如 `public/docs`

脚本设置示例（`/package.json`）：

```json
{
  "scripts": {
    "docs": "menuet-docs --lang zh-cn --config config/api-docs.json --output public/docs"
  }
}
```

配置文件内容如下（`/config/api-docs.json`）：

```json
{
  "title": "示例工程 API 文档",
  "stylesheets": [ "../css/docs.css" ],
  "copyright": "&copy; 2017-present LiveBridge Information Technology Co., Ltd."
}
```

执行脚本，生成 API 文档：

```shell
$ npm run docs
```