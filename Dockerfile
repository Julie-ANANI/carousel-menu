FROM node:6.10.2

RUN apt-get clean && \
    apt-get update

RUN npm install -g @angular/cli


WORKDIR /var/web
ADD package.json package.json
ADD . .


WORKDIR /var/web
RUN npm install --production
RUN ng build --prod --aot

EXPOSE  3080
CMD ["npm", "start"]
