# Reference 
# https://docs.docker.com/engine/reference/run/commandline/
# Build Docker File
# docker build -t rsschool-nodejs .
# Run Docker File
# docker run -p 0.0.0.0:4000:4000/tcp --rm -d --name rss-nodejs rsschool-nodejs
# docker run --rm -p 0.0.0.0:4000:4000/tcp -p [::1]:4000:4000 -d --name rss-nodejs rsschool-nodejs
# Connect with psql
# psql -h localhost -p 5432 -d revamp -U admin --password      


FROM ubuntu:22.04

RUN apt-get update && apt-get install -y curl ca-certificates

RUN adduser --system nodejs

USER nodejs

RUN cd ~/ && touch .bashrc && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
RUN . ~/.bashrc && nvm install lts/hydrogen
#RUN mkdir ~/app
WORKDIR  /home/nodejs/
#COPY src ./src
COPY ./ ./app/ 
USER root
RUN chown -R nodejs /home/nodejs/app
USER nodejs
#RUN cd ~/app
WORKDIR /home/nodejs/app
RUN . ~/.bashrc && npm install && npm run build 
#COPY ./src ~/app/
#COPY ../../node_modules ~/app/
#CMD ["bash", "node", "./dist/bundle.js"]
#CMD ["bash", "-c", "node", "./dist/bundle.js"]

EXPOSE 4000

CMD . ~/.bashrc; node /home/nodejs/app/dist/bundle.js
#USER root
#CMD  [/bin/sh]
