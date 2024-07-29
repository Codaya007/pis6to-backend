FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4004
EXPOSE 5005

CMD ["npm", "start"]
