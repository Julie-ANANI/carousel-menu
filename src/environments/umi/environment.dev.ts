// 10 minutes for the expiration time

export const environment = {
  local: false,
  production: false,
  apiUrl: 'https://api-dev.umi.us/api', // 'http://umiapplication:3000/api'
  clientUrl: 'https://umicli-dev.umi.us',
  companyName: 'United Motion Ideas (dev)',
  companyShortName: 'UMI',
  domain: 'umi',
  quizUrl: 'https://quizdev.umi.us',
  companyURL: 'https://www.umi.us',
  logoURL: 'https://res.cloudinary.com/umi/image/upload/app/default-images/company-logo/logo-umi-animated-2020.gif',
  logoSynthURL: 'https://res.cloudinary.com/umi/image/upload/app/default-images/company-logo/logo-umi-trans-2020.png',
  background: 'https://res.cloudinary.com/umi/image/upload/v1527583034/app/default-images/cover-image.jpg',
  commercialContact: 'klegrand@umi.us',
  secureCookie: true,
  cookieTime: 600 * 1000
};
