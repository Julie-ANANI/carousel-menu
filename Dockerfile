FROM node:10.13.0

RUN echo ${APP_NAME}
RUN echo "${ENV_NAME}"

RUN apt-get clean && \
    apt-get update

RUN npm install -g @angular/cli
RUN npm install -g typings

WORKDIR /var/web
ADD package.json package.json
ADD .npmrc /var/web/.npmrc
ADD . .

RUN npm install

RUN echo "!!!!!! Builing with ng build ${APP_NAME} -c=${ENV_NAME} --prod !!!!!!"

RUN ng config -g cli.warnings.versionMismatch false
#RUN ng build ${APP_NAME} -c=${ENV_NAME} --prod
#RUN ng run ${APP_NAME}:server -c=${ENV_NAME}
RUN ng build umi -c=dev --prod
RUN ng run umi:server -c=dev
RUN gzip -k -r dist/browser/
RUN npm run webpack:server
RUN rm -f /var/web/.npmrc

EXPOSE  3080
CMD ["npm", "run", "serve:ssr"]
