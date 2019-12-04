# add the necessary instructions
# to create a Docker container image
# for your summary client using the
# NGINX web server image as the base

FROM node:11.12.0-alpine as build-stage
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install react-scripts@latest -g
COPY . /usr/src/app
RUN CI=true npm test
RUN npm run build

# Stage 1
# Production build based on Nginx with artefacts from Stage 0
FROM nginx:1.15.9-alpine
ADD default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]