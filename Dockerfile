# Step 1: Build the Vite app
FROM node:18 AS build

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vite app (output goes to /app/dist)
RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the Vite build output to Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the web service
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
