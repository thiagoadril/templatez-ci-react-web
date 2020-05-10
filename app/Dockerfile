FROM node:12.16.1 AS build

WORKDIR /app

FROM nginx:1.17.9-alpine AS Nginx

COPY /deploy/nginx/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /var/www*

COPY /build /var/www

RUN rm -rf /etc/localtime && ln -s /usr/share/zoneinfo/Brazil/East /etc/localtime

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]