# Reference 
# https://docs.docker.com/engine/reference/run/commandline/
# Build Docker File
# docker build -t rsschool-pgsql .
# Run Docker File
# docker run -p 0.0.0.0:5432:5432/tcp --rm -d -P --name rsschool-pgsql rsschool-pgsql
# Connect with psql
# psql -h localhost -p 5432 -d revamp -U admin --password      

FROM ubuntu:22.04

ARG POSTGRES_PORT=5432

# Add the PostgreSQL PGP key to verify their Debian packages.
# It should be the same key as https://www.postgresql.org/media/keys/ACCC4CF8.asc
RUN apt-get update && apt-get install -y gnupg2 curl ca-certificates
# ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn
# RUN apt-key adv --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4
RUN curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | tee /etc/apt/trusted.gpg.d/apt.postgresql.org.gpg >/dev/null

# Add PostgreSQL's repository. It contains the most recent stable release
#     of PostgreSQL, ``15``.
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ jammy-pgdg main" > /etc/apt/sources.list.d/pgdg.list

# Install ``python-software-properties``, ``software-properties-common`` and PostgreSQL 15
#  There are some warnings (in red) that show up during the build. You can hide
#  them by prefixing each apt-get statement with DEBIAN_FRONTEND=noninteractive
RUN DEBIAN_FRONTEND=noninteractive apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y postgresql-15 \
    && apt-get clean \
    && apt-get autoremove  --yes --purge \
    && rm -rf /var/lib/{apt,dpkg,cache,log}/

# Note: The official Debian and Ubuntu images automatically ``apt-get clean``
# after each ``apt-get``

COPY ./volume_init.sh /
RUN chmod a+x /volume_init.sh

# Run the rest of the commands as the ``postgres`` user created by the ``postgres-15`` package when it was ``apt-get installed``
USER postgres

# Adjust PostgreSQL configuration so that remote connections to the
# database are possible.
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/15/main/pg_hba.conf

# And add ``listen_addresses`` to ``/etc/postgresql/15/main/postgresql.conf``
RUN echo "listen_addresses='*'" >> /etc/postgresql/15/main/postgresql.conf

RUN echo "PORT = $POSTGRES_PORT" >> /etc/postgresql/15/main/postgresql.conf

# Expose the PostgreSQL port
EXPOSE $POSTGRES_PORT

CMD /volume_init.sh \
    && /usr/lib/postgresql/15/bin/postgres -D /var/lib/postgresql/15/main -c config_file=/etc/postgresql/15/main/postgresql.conf
