# Use an official Node.js runtime as the base image
FROM node:18-alpine as dev

ARG PORT=4000
ENV PORT=$PORT

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
# Copy the application code into the container
COPY *.json ./

COPY src ./src

COPY .env  ./

# Install application dependencies
RUN npm install && npm run build && npm cache clean --force

# Expose a port that the application will listen on
EXPOSE $PORT

# Command to run your application
CMD [ "npm", "run", "start:dev" ]


FROM node:18-slim as prod


# Set the working directory in the container
WORKDIR /usr/src/app

COPY --from=dev /usr/src/app/*.json ./
COPY --from=dev /usr/src/app/dist/ ./dist/
COPY --from=dev /usr/src/app/.env ./

# Install application dependencies
RUN npm install --omit=dev && npm cache clean --force
# Expose a port that the application will listen on
EXPOSE $PORT

# Command to run your application
CMD [ "npm", "run", "start:prod" ]
