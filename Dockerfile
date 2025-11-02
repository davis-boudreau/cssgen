# Step 1: Use a Node.js base image
FROM node:latest AS build

# Set the working directory in the container
WORKDIR /app

# Step 2: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 3: Install dependencies
RUN npm install

# Step 4: Copy the rest of the application
COPY . .

# Step 5: Build the React app for production
RUN npm run build

# Step 6: Use a lighter image to serve the built app (using Nginx here)
FROM nginx:alpine

# Step 7: Copy the build files from the previous stage into the Nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to serve the app
EXPOSE 80

# Step 8: Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
