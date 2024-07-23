# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install


# Copy the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port on which your app will run
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
