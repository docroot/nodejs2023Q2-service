#!/bin/sh

service postgresql start

user_exists=$(psql -c "SELECT 1 FROM pg_user WHERE usename='$POSTGRES_USER'" -t)

if [ -z "$user_exists" ]; then
    echo "User '$POSTGRES_USER' does not exist."
    psql -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';"
else
    echo "User '$POSTGRES_USER' exists."
fi

# Check if the database exists
database_exists=$(psql -c "SELECT 1 FROM pg_database WHERE datname='$POSTGRES_DB'" -t)

if [ -z "$database_exists" ]; then
    echo "Database '$POSTGRES_DB' does not exist."
    psql -c "CREATE DATABASE $POSTGRES_DB;"
    psql -c "GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;"
else
    echo "Database '$POSTGRES_DB' exists."
fi

service postgresql stop
