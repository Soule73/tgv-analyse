FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Intall dependencies
RUN npm install --production

# Copy the server file to the container
COPY server.js .

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
