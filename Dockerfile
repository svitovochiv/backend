FROM node:18.15.0-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
COPY prisma /tmp/app/prisma/
RUN cd /tmp/app && npm install && npm run prisma:generate

COPY .env /usr/src/app/.env
COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./startup.prod.sh /opt/startup.prod.sh
RUN sed -i 's/\r//g' /opt/startup.prod.sh
RUN chmod 775 /opt/startup.prod.sh

WORKDIR /usr/src/app
RUN npm run build

EXPOSE 8080
EXPOSE 8081
EXPOSE 8070
EXPOSE 8071
ENTRYPOINT ["sh", "/opt/startup.prod.sh"]
