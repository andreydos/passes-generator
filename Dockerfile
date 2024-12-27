FROM node:18

WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3033

CMD ["npm", "start"]

