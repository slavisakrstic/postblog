# grab the prod dependencies
FROM node:12 AS alldeps

USER node

RUN mkdir /home/node/app
WORKDIR /home/node/app

COPY --chown=node package.json package-lock.json ./

RUN npm set progress=false && \
  npm ci

FROM alldeps AS builder
COPY . .
ENV NODE_ENV production
ENV GENERATE_SOURCEMAP false
RUN npm run build

FROM nginx:1.17-alpine

COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/www/html
COPY --from=builder /home/node/app/build /var/www/html/

RUN touch /run/nginx.pid && \
  chown -R nginx:nginx /run/nginx.pid && \
  chown -R nginx:nginx /var/www && \
  chown -R nginx:nginx /usr/share/nginx && \
  chown -R nginx:nginx /var/cache/nginx

# Runtime
EXPOSE 8080
USER nginx
CMD ["nginx", "-g", "daemon off;"]
