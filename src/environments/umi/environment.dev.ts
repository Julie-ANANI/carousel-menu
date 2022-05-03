// 48hrs for the expiration time

export const environment = {
  local: false,
  production: false,
  env: 'dev',
  apiUrl: 'https://dev.umi.us/api', // 'http://umiapplication:3000/api'
  etherpadUrl: 'https://etherpad-dev.umi.us',
  /**
   * this is the url for apisix server on dev
   */
  apiGatewayUrl: 'https://api-dev.umi.us/v3/api',
  clientUrl: 'https://umicli-dev.umi.us',
  companyName: 'United Motion Ideas (dev)',
  companyShortName: 'UMI',
  domain: 'umi',
  quizUrl: 'https://quizdev.umi.us',
  grafanaUrl: 'https://grafana-dev.umi.us',
  companyURL: 'https://www.umi.us',
  logoURL: 'https://res.cloudinary.com/umi/image/upload/app/default-images/company-logo/logo-umi-animated-2020.gif',
  logoSynthURL: 'https://res.cloudinary.com/umi/image/upload/app/default-images/company-logo/logo-umi-trans-2020.png',
  background: 'https://res.cloudinary.com/umi/image/upload/f_auto/app/default-images/backgrounds/umi-welcome-picture-2021.jpg',
  commercialContact: 'achampagne@umi.us',
  secureCookie: true,
  cookieTime: 48 * 3600 * 1000
};
