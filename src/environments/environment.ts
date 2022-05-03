// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The cookie expiration time is 48h by default

export const environment = {
  local: true,
  production: false,
  env: '',
  apiUrl: '',
  etherpadUrl: '',
  clientUrl: '',
  apiGatewayUrl: '',
  companyName: '',
  companyShortName: '',
  companyURL: '',
  logoURL: '',
  domain: '',
  quizUrl: '',
  grafanaUrl: '',
  logoSynthURL: '',
  background: '',
  secureCookie: false,
  commercialContact: '',
  cookieTime: 48 * 3600 * 1000
};

