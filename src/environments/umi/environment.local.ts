export const environment = {
  local: true,
  env: 'local',
  production: false,
  apiUrl: 'http://localhost:3000/api',
  etherpadUrl: 'http://localhost:9001',
  clientUrl: 'http://localhost:4200',
  // If you don't want to launch apisix at local, just change the url in apiUrl.interceptors
  apiGatewayUrl: 'http://127.0.0.1:9080/v3/api',
  companyName: 'United Motion Ideas (local)',
  companyShortName: 'UMI',
  domain: 'umi',
  quizUrl: 'http://localhost:3080',
  grafanaUrl: 'http://localhost:3013',
  companyURL: 'https://www.umi.us',
  logoURL: 'https://res.cloudinary.com/umi/image/upload/app/default-images/company-logo/logo-umi-animated-2020.gif',
  logoSynthURL: 'https://res.cloudinary.com/umi/image/upload/app/default-images/company-logo/logo-umi-trans-2020.png',
  background: 'https://res.cloudinary.com/umi/image/upload/f_auto/app/default-images/backgrounds/umi-welcome-picture-2021.jpg',
  commercialContact: 'achampagne@umi.us',
  secureCookie: false,
  cookieTime: 3600 * 1000
};
