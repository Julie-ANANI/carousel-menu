ARG VERSION=latest
FROM unitedmotionideas/frontbase:${VERSION} AS buildinstance

ARG APP_NAME
ARG ENV_NAME
ARG VERSION

WORKDIR /var/web

# update browser list
RUN npx browserslist --update-db

# build client
RUN echo build ${APP_NAME} -c=${ENV_NAME}
RUN node --max-old-space-size=10240 ./node_modules/@angular/cli/bin/ng build --progress ${APP_NAME} -c=${ENV_NAME}

# upload source-map to sentry
RUN if [ $VERSION != "latest" ]; then npm install @sentry/cli; fi
RUN if [ $VERSION != "latest" ]; then ./node_modules/.bin/sentry-cli releases new ${VERSION}; fi
RUN if [ $VERSION != "latest" ]; then ./node_modules/.bin/sentry-cli releases files ${VERSION} upload-sourcemaps dist/browser; fi
RUN rm -f /var/web/.sentryclirc

# delete source-map files
RUN if [ $ENV_NAME == 'production']; then rm dist/browser/*.js.map; fi

# build server
RUN ng run ${APP_NAME}:server -c=${ENV_NAME}

# gzip every files for the browser
RUN gzip -k -r dist/browser/

RUN npm run server:webpack

EXPOSE  3080
CMD ["npm", "run", "serve:ssr"]
