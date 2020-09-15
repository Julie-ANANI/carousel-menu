ARG VERSION=latest
FROM unitedmotionideas/frontbase:${VERSION} AS buildinstance

ARG APP_NAME
ARG ENV_NAME
ARG VERSION

WORKDIR /var/web

# build client
RUN echo build ${APP_NAME} -c=${ENV_NAME} --prod
RUN node --max-old-space-size=5120 ./node_modules/@angular/cli/bin/ng build --progress ${APP_NAME} -c=${ENV_NAME} --prod

# upload source-map to sentry
RUN if [ $VERSION != "latest" ]; then npm install @sentry/cli@7.3.8; fi
RUN if [ $VERSION != "latest" ]; then ./node_modules/.bin/sentry-cli releases new ${VERSION}; fi
RUN if [ $VERSION != "latest" ]; then ./node_modules/.bin/sentry-cli releases files ${VERSION} upload-sourcemaps dist/browser; fi
RUN rm -f /var/web/.sentryclirc

# delete source-map files
RUN rm dist/browser/*.js.map

# build server
RUN ng run ${APP_NAME}:server -c=${ENV_NAME}

# gzip every files for the browser
RUN gzip -k -r dist/browser/

RUN npm run webpack:server

EXPOSE  3080
CMD ["npm", "run", "serve:ssr"]
