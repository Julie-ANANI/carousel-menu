FROM node:6.10.2

RUN apt-get clean && \
    apt-get update

RUN npm install -g @angular/cli@1.7.4
RUN npm install -g typings
#RUN npm rebuild node-sass --force

WORKDIR /var/web
ADD package.json package.json
ADD .npmrc /var/web/.npmrc
ADD . .


WORKDIR /var/web
RUN npm install
RUN ng build --app=inomer --environment=prod --prod --aot
#RUN ng build --app=umi --environment=dev --prod --aot
RUN rm -f /var/web/.npmrc

EXPOSE  3080
CMD ["npm", "start"]
