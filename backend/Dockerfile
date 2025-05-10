FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if you use yarn)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
