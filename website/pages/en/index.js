
const React = require('react');

const styles = [
  '/css/home.css'
];

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="home-container">
        <div className="home-splash-fade">
          <div className="wrapper home-wrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="project-logo">
        <img src={props.src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="project-title">
        {siteConfig.tagline}
        <small>{siteConfig.description}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promo-section">
        <div className="promo-row">{props.children}</div>
      </div>
    );

    const Button = props => (
      <div className="button-wrapper">
        <a className={ 'button button-circle' + (props.full ? ' button-full' : '')} href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <Logo src={`${baseUrl}img/home-bg.png`} />
        <div className="inner">
          <ProjectTitle siteConfig={ siteConfig } />
          <PromoSection>
            <Button href={ docUrl('intro') } full={ true }>开始使用</Button>
            <Button href={ siteConfig.repoUrl } target="_blank">GitHub</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;

    return (
      <div>
        {styles.map(url => (
          <link rel="stylesheet" type="text/css" href={url} key={url} />
        ))}
        <HomeSplash siteConfig={siteConfig} language={language} />
      </div>
    );
  }
}

module.exports = Index;
