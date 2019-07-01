FROM node:10.13.0 AS baseimage

ARG APP_NAME
ARG ENV_NAME
ARG VERSION

RUN echo "!!!!!! Building front@${VERSION} with 'ng build ${APP_NAME} -c=${ENV_NAME} --prod' !!!!!!"

RUN apt-get clean && \
    apt-get update

RUN npm install -g @angular/cli
RUN npm install -g typings

WORKDIR /var/web
ADD . .

RUN npm install
RUN rm -f /var/web/.npmrc

# update version
RUN if [ $VERSION ]; then sed -i -e "s/latest/$VERSION/g" src/environments/version.ts; fi



FROM unitedmotionideas/frontbase:latest AS buildinstance

COPY --from=baseimage /var/web .

ARG APP_NAME
ARG ENV_NAME
ARG VERSION

WORKDIR /var/web

# build client
RUN ng build ${APP_NAME} -c=${ENV_NAME} --prod

# upload source-map to sentry
RUN if [ $VERSION ]; then npm install @sentry/cli; fi
RUN if [ $VERSION ]; then ./node_modules/.bin/sentry-cli releases new ${VERSION}; fi
RUN if [ $VERSION ]; then ./node_modules/.bin/sentry-cli releases files ${VERSION} upload-sourcemaps dist/browser; fi
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
