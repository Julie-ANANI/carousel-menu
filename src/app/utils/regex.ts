export const emailRegEx = /^[a-zA-Z][\w\-\.]+\@{1}(?=\w)[\w\.\-]+$/;
export const domainRegEx = /^[*]+\@{1}(?=\w)[\w\.\-]+$/;
export const urlRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
export const phoneRegEx = /^\+?[0-9 \.\-\(\)]+$/;

export const videoDomainRegEx = /youtu\.?be|vimeo/;

export const vimeoVideoId = /([^vimeo\.com\/]+)(\d+)(?=\/?)/; // Javascript does not support positive lookbehinds
export const youtubeVideoId = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
