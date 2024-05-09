FROM node:20.12.2

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

RUN npm run build

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

EXPOSE 4000

CMD ["npm", "run", "start"]
