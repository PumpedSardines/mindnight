FROM  node:20

COPY . /app
WORKDIR /app

RUN npm ci
RUN npm run build

RUN npm run init
RUN npm run build
CMD npm run start:prod
