FROM node:10.13.0

ARG APP_NAME
ARG ENV_NAME
ARG VERSION

#RUN echo ${APP_NAME}
#RUN echo "${ENV_NAME}"

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

# build client
RUN ng build ${APP_NAME} -c=${ENV_NAME} --prod

# upload source-map to sentry
RUN npm install @sentry/cli
RUN ./node_modules/.bin/sentry-cli releases files ${VERSION} upload-sourcemaps --ext js --ext map dist/browser
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
