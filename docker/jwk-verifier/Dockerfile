FROM node:12.18.0-alpine3.10

COPY index.js package.json /usr/src/app/

WORKDIR /usr/src/app
RUN npm install --only=production

EXPOSE 9000
CMD ["npm", "start"]
