FROM node:18

WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
EXPOSE 3033

CMD ["npm", "start"]

