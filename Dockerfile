# Reference 
# https://docs.docker.com/engine/reference/run/commandline/
# Build Docker File
# docker build -t rsschool-nodejs .
# Run Docker File
# docker run -p 0.0.0.0:4000:4000/tcp --rm -d --name rss-nodejs rsschool-nodejs
#  OR (tests use IPv6 address for localhost)
# docker run --rm -p 0.0.0.0:4000:4000/tcp -p [::1]:4000:4000 -d --name rss-nodejs rsschool-nodejs


FROM ubuntu:22.04 as build

ARG PORT=4000

RUN apt-get update && apt-get install -y curl ca-certificates

RUN adduser --system nodejs

USER nodejs

RUN cd ~/ && touch .bashrc && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
RUN . ~/.bashrc && nvm install lts/hydrogen
WORKDIR  /home/nodejs/
COPY ./ ./app/ 
USER root
RUN chown -R nodejs /home/nodejs/app

USER nodejs
WORKDIR /home/nodejs/app
RUN . ~/.bashrc && npm install && npm run build && npm cache clean --force && nvm cache clear && rm -rf ~/app/node_modules

# build production image
FROM ubuntu:22.04 as prod

USER root
RUN adduser --system nodejs


# Copy only the necessary artifacts from the previous build stage
COPY --from=build /home/nodejs/ /home/nodejs/
RUN chown -R nodejs /home/nodejs/
USER nodejs
WORKDIR /home/nodejs/app
RUN . ~/.bashrc && npm install --omit=dev && npm cache clean --force && nvm cache clear

# change files owner so nodejs user is not able to modify them
USER root
RUN chown -R root:root /home/nodejs/app

USER nodejs
EXPOSE $PORT
CMD . ~/.bashrc; node /home/nodejs/app/dist/bundle.js
