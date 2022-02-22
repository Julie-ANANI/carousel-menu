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
RUN node --max-old-space-size=11266 ./node_modules/@angular/cli/bin/ng build --progress ${APP_NAME} -c=${ENV_NAME}

# upload source-map to sentry
RUN if [ $VERSION != "latest" && $ENV_NAME == 'production' ]; then npm install @sentry/cli; fi
RUN if [ $VERSION != "latest" && $ENV_NAME == 'production' ]; then ./node_modules/.bin/sentry-cli releases new ${VERSION}; fi
RUN if [ $VERSION != "latest" && $ENV_NAME == 'production' ]; then ./node_modules/.bin/sentry-cli releases files ${VERSION} upload-sourcemaps dist/browser; fi
RUN rm -f /var/web/.sentryclirc

# delete source-map files
RUN if [ $ENV_NAME == 'production']; then rm dist/browser/*.js.map; fi

# build server
RUN ng run ${APP_NAME}:server -c=${ENV_NAME}

# gzip every files for the browser
RUN gzip -k -r dist/browser/

RUN npm run server:webpack

RUN rm package-lock.json
RUN rm -rf src/
RUN rm angular.json
RUN rm tsconfig.json
RUN rm -rf e2e/
RUN rm -rf doc/
RUN rm CHANGELOG.md
RUN rm README.md
RUN rm -rf node_modules/
RUN rm tsconfig.app.json
RUN rm tsconfig.server.json
RUN rm tsconfig.skipTests.json


EXPOSE  3080
CMD ["npm", "run", "serve:ssr"]
