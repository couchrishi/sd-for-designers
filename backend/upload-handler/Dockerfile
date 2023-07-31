# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./


# Install dependencies
RUN npm install

# Copy the rest of the backend code to the container
COPY . .

# Create a new folder 'my-folder' inside the container
RUN mkdir uploads && chmod 777 uploads

# Expose the port on which your application will listen
#EXPOSE 5000

#EXPOSE 80

# Start the application
CMD ["npm", "start"]
