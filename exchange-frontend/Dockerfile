FROM node:16.14-alpine as build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod

FROM nginx:latest

COPY ./nginx/nginx.conf.tpl /nginx.conf.tpl
CMD /bin/sh -c "envsubst '\$API_URL' < /nginx.conf.tpl > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
COPY --from=build-step /app/dist/exchange-frontend /usr/share/nginx/html

EXPOSE 80