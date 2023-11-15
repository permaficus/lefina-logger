FROM node:18-alpine
WORKDIR /app/lefina-logger
RUN npm install -g nodemon
COPY package*.json /lefina-logger/
RUN npm install
COPY . /app/lefina-logger/
EXPOSE 3030
CMD [ "npm", "start" ]
