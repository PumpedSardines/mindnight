FROM node:20 as build

COPY . package.json /app
COPY . package-lock.json /app
WORKDIR /app

RUN npm ci
RUN npm run init
RUN npm run build

FROM node:20

COPY . /app
WORKDIR /app

RUN rm -rf src
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules

CMD npm run start:prod

