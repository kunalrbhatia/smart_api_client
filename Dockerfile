# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR ./

# Copy package.json and package-lock.json to the container's working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's source code to the container's working directory
COPY . .

# Build your React app (replace 'build' with your actual build command)
RUN npm run build

# Install 'serve' globally to serve static files
RUN npm install -g serve

# Specify the command to serve your production build
CMD ["serve", "-s", "build"]
