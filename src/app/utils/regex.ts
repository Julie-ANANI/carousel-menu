export const emailRegEx = /^([a-zA-Z0-9])[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
export const domainRegEx = /^[*]+\@{1}(?=\w)[\w\.\-]+$/;
export const urlRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
export const phoneRegEx = /^\+?[0-9 \.\-\(\)]+$/;

export const videoDomainRegEx = /youtu\.?be|vimeo/;
export const cloudinaryImageRegEx = /https?:\/\/res\.cloudinary\.com/gm;

export const vimeoVideoId = /([^vimeo\.com\/\?]+)(\d+)(?=\/?)/; // Javascript does not support positive lookbehinds
export const youtubeVideoId = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;

export const specialCharRegEx = /[^a-zA-Z0-9 ]/g;
export const emptyHtmlRegex = /<!DOCTYPE HTML><html><body>(<br>)+<\/body><\/html>/g;
export const htmlTagsRegex = /<.+?>/g;

export const replaceNumberRegex = /(?:\s)[\d]+(?=\s)/gm;

export const proIdRegex = /^[a-f\d]{24}$/i;
