# Use an official Node.js runtime as a parent image
FROM node

# Set the working directory to /app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install && npx puppeteer browsers install chrome

COPY . .
COPY .env ./

ENV NODE_ENV=production

RUN npm run build

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run app.js when the container launches
CMD ["npm", "run", "start"]
