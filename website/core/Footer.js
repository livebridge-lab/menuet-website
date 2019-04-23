/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          {/* <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a> */}
          <div>
            <h4>链接</h4>
            <a href={this.props.config.repoUrl} target="_blank">
              代码仓库
            </a>
            <a href={this.docUrl('doc2.html')}>
              常见问题
            </a>
            <a href={this.props.config.repoUrl + '/issues'} target="_blank">
              Issues
            </a>
            {/* <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count="true"
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a> */}
          </div>
          <div>
            <h4>更多产品</h4>
            <a href={this.pageUrl('users.html')}>
              Codelet - 快速开发框架
            </a>
            <a
              href="https://www.proding.net/"
              target="_blank"
              rel="noreferrer noopener">
              CodingEX - 开发规范与最佳实践
            </a>
            <a href="https://discordapp.com/">
              Softeaming - 软件团队协作工具
            </a>
            <a href="https://tangram.proding.net/" target="_blank">
              ng-tangram - Angular UI 组件库
            </a>
          </div>
          <div className="company-logo">
            <a className="code-dance">
              <img src={this.props.config.baseUrl + 'img/code-dance.png'} />
            </a>
          </div>
          
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
