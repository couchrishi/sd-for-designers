# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code to the container
COPY . .

# Build the React application
RUN npm run build

# Expose the port on which your application will run (assuming the application uses port 80)
EXPOSE 80

# Start the server to serve the built React application
CMD ["npm", "start"]
