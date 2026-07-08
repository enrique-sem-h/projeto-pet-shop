FROM node:24

WORKDIR /app

COPY ../package.json .

RUN npm cache clean --force
RUN npm install
COPY . .

ENV path=../.env

EXPOSE 3000

CMD ["npm", "run", "start:dev"]