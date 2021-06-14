FROM node:12.19.1 AS prodbuild

WORKDIR /home/node/app

COPY package.json package-lock.json ./

RUN npm set progress=false && \
  npm ci --only=production

FROM prodbuild AS prebuild

RUN npm set progress=false && \
  npm ci

FROM prebuild as build
COPY . .
RUN npm run build

FROM node:12.19.1-alpine

ENV NODE_ENV production

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY --from=prodbuild --chown=node:node /home/node/app/node_modules ./node_modules
COPY --from=build --chown=node:node /home/node/app/dist ./dist
COPY --from=prodbuild --chown=node:node /home/node/app/package.json ./package.json

USER node
EXPOSE 3000

CMD ["npm", "start"]
