/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module '@umius/umi-session-verifications';
declare module 'file-saver';
declare module 'lodash';
declare module 'js-sha1';

/* server.ts - NodeJS modules for express */
declare module 'mime-types';
