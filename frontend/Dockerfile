FROM  node:20-alpine as build

COPY . /app
WORKDIR /app

RUN npm ci
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/
