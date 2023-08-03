FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN npm install express -g
RUN npm install body-parser -g
RUN npm install axios -g
RUN npm install nodemon -g
COPY . .
EXPOSE 3001
RUN chown -R node /usr/src/app
USER node
CMD ["nodemon"]
