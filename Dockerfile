# Node 18 base image
FROM node:18-alpine
# Set working directory
WORKDIR /in-season-backend
# Copy app files
COPY . .
# Clean install of all project dependencies, based on package-lock.json
RUN npm ci
EXPOSE 8080
# Start the server
CMD npm start