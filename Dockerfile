FROM node:6.10.2

RUN apt-get clean && \
    apt-get update

RUN npm install -g @angular/cli
RUN npm install -g typings

WORKDIR /var/web
ADD package.json package.json
ADD .npmrc /var/web/.npmrc
ADD . .


WORKDIR /var/web
RUN npm install --production
#RUN ng build --prod --aot
RUN ng build --app=umi --environment=prod --aot
RUN rm -f /var/web/.npmrc

EXPOSE  3080
CMD ["npm", "start"]
