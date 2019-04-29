FROM node:10.13.0

ARG APP_NAME
ARG ENV_NAME
ARG VERSION

#RUN echo ${APP_NAME}
#RUN echo "${ENV_NAME}"

RUN echo "!!!!!! Builing with ng build ${APP_NAME} -c=${ENV_NAME} --prod !!!!!!"

RUN apt-get clean && \
    apt-get update

RUN npm install -g @angular/cli
RUN npm install -g typings

WORKDIR /var/web
ADD package.json package.json
ADD .npmrc /var/web/.npmrc
ADD . .

RUN npm install
RUN if [ $VERSION ]; then sed -i -e "s/latest/$VERSION/g" src/environments/version.ts; fi
RUN ng build ${APP_NAME} -c=${ENV_NAME} --prod
#RUN ng build umi -c=dev
RUN ng run ${APP_NAME}:server -c=${ENV_NAME}
#RUN ng run umi:server -c=dev
RUN gzip -k -r dist/browser/
RUN npm run webpack:server
RUN rm -f /var/web/.npmrc

EXPOSE  3080
CMD ["npm", "run", "serve:ssr"]
