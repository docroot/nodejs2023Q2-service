# Reference 
# https://docs.docker.com/engine/reference/run/commandline/
# Build Docker File
# docker build -t rsschool_pgsql .
#
# Run Docker File (this command can be used if image was built wih docker-compose build)
#
# docker run -p 5432:5432/tcp --rm -d -P -v rsschool-pgdata:/var/lib/postgresql/ --name rsschool-pgsql rsschool_pgsql
#
# Connect with psql
#
# psql -h localhost -p 5432 -d <db> -U <user> --password      
#

FROM postgres:latest

ARG POSTGRES_PORT=5432
ARG POSTGRES_PASSWORD

ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV POSTGRES_HOST_AUTH_METHOD=md5
ENV PGPORT=$POSTGRES_PORT

# (Optional) Copy any additional initialization scripts
COPY volume_init.sh /docker-entrypoint-initdb.d/
RUN chmod a+x /docker-entrypoint-initdb.d/volume_init.sh

# (Optional) Set any other configurations as needed
ENV POSTGRES_LOG_STATEMENTS=all

# (Optional) Set the timezone for PostgreSQL
ENV TZ=UTC

# (Optional) Add any necessary customizations

# (Optional) Healthcheck to ensure PostgreSQL is running (requires PostgreSQL 9.3+)
# HEALTHCHECK --interval=10s CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB
