FROM mhart/alpine-node:12.13.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY . ./
EXPOSE 4000
CMD ["npm", "run", "start"]