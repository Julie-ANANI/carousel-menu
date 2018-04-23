export const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const urlRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
export const phoneRegEx = /^\+?[0-9 \.\-\(\)]+$/;

export const videoDomainRegEx = /youtu\.?be|vimeo/;
export const videoIdRegEx = /([^vimeo\.com\/]+)(\d+)(?=\/?)|(watch\?v\=)([\w-]+)/; //Javascript does not support positive lookbehinds
