export interface BlacklistDomain {
  domain: string;
  logo: string;
  name: string;
}

export interface BlacklistEmail {
  text: string;
}

export interface Blacklist {
  emails: Array<BlacklistEmail>;
  domains: Array<BlacklistDomain>;
}
