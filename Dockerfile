FROM node:6.10.2

ARG APP_NAME
ARG ENV_NAME

RUN \
# Check for mandatory build arguments
    : "${APP_NAME:?The name of the application needs to be set and non-empty.}" \
    : "${ENV_NAME:?The environment name needs to be set and non-empty.}"

RUN echo "!!!!! Builing with ng build --app=${APP_NAME} --environment=${ENV_NAME} --prod --aot !!!!!"

RUN apt-get clean && \
    apt-get update

RUN npm install -g @angular/cli@1.7.4
RUN npm install -g typings

WORKDIR /var/web
ADD package.json package.json
ADD .npmrc /var/web/.npmrc
ADD . .


WORKDIR /var/web
RUN npm install
RUN ng build --app=${APP_NAME} --environment=${ENV_NAME} --prod --aot
RUN rm -f /var/web/.npmrc

EXPOSE  3080
CMD ["npm", "start"]
