export const environment = {
  local: true,
  production: false,
  // apiUrl: 'http://localhost:3000/api',
  etherpadUrl: 'http://localhost:9001',
  clientUrl: 'http://localhost:4200',
  // If you don't want to launch apisix at local, just change the url in apiUrl.interceptors
  apiUrl: 'http://192.168.1.32:9080',
  companyName: 'United Motion Ideas (local)',
  companyShortName: 'UMI',
  domain: 'umi',
  quizUrl: 'http://localhost:3080',
  companyURL: 'https://www.umi.us',
  logoURL: 'https://res.cloudinary.com/umi/image/upload/app/default-images/company-logo/logo-umi-animated-2020.gif',
  logoSynthURL: 'https://res.cloudinary.com/umi/image/upload/app/default-images/company-logo/logo-umi-trans-2020.png',
  background: 'https://res.cloudinary.com/umi/image/upload/f_auto/app/default-images/backgrounds/umi-welcome-picture-2021.jpg',
  commercialContact: 'achampagne@umi.us',
  secureCookie: false,
  cookieTime: 3600 * 1000
};
