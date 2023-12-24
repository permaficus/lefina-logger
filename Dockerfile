FROM node:21.4.0-alpine3.19
WORKDIR /app/lefina-logger
RUN npm install -g nodemon
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma db push
RUN npx prisma generate
EXPOSE 3030
CMD [ "npm", "start" ]
