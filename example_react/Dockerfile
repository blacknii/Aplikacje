# Step 1: Use node to build the React app
FROM node:18 AS build

# Set working directory in container
WORKDIR /app

# Copy the package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Step 2: Use nginx to serve the built files
FROM nginx:alpine

# Copy the built files from the previous stage to the nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for HTTP
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
