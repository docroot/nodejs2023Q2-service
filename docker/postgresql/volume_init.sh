#!/bin/sh

# echo "User '$DB_USER'"
# echo "DB '$DB_NAME'"

user_exists=$(psql -c "SELECT 1 FROM pg_user WHERE usename='$DB_USER'" -t)

if [ -z "$user_exists" ]; then
    echo "User '$DB_USER' does not exist."
    psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
else
    echo "User '$DB_USER' exists."
fi

# Check if the database exists
database_exists=$(psql -c "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" -t)

if [ -z "$database_exists" ]; then
    echo "Database '$DB_NAME' does not exist."
    psql -c "CREATE DATABASE $DB_NAME;"
    psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    psql -c "ALTER DATABASE $DB_NAME OWNER TO $DB_USER;"
else
    echo "Database '$DB_NAME' exists."
fi
