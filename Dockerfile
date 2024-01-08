# Start from the official Puppeteer image to include all necessary dependencies
FROM ghcr.io/puppeteer/puppeteer:21.6.1

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (or yarn equivalent)
COPY package*.json ./

# Clean Install app dependencies, including 'npm install' for the Node.js packages
RUN npm ci

# Copy the rest of the application source code to the image
COPY . .

# Build the application, this step is necessary if you're using TypeScript
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your app using the script from package.json
CMD ["npm", "run", "start"]

