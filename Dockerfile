# Use the official Node.js image as the base image
FROM node:20

WORKDIR /app

COPY . /app

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]