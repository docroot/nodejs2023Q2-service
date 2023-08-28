# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Building and running using Docker

First, you need to have Docker installed.

### Creating volume for storing DB

```
docker volume create --name=pg_data
```

### Creating volume for storing app's logs

```
docker volume create --name=node_logs
```

### building postgres and app images

Run following command from root directory of the project:

```
docker compose build
```

### Running using Docker

To run app execute:

```
docker compose up -d
```

-d options is needed for detaching from the console

To stop app:

```
docker compose down
```

### Running in dev mode using Docker


To use dev mode (auto restart app on changes in src folder) specify dev configuration file:

```
docker compose -f ./docker-compose-dev.yml build

docker compose -f ./docker-compose-dev.yml up

docker compose -f ./docker-compose-dev.yml down

```

Also, you need to create a folder named 'logs' in the root directory of the project, it is mounted inside the app's container in dev mode, so you are able to access logs easily


### Mixed execution

Unfortunately  suitable development mode (restarting upon changes in src folder)  for docker is not implemented yet.
But it is possible to run postgres container separately and run the app as usual, also you have to change POSTGRES_HOST variable in .env file to 'localhost':

```
docker run -p [::1]:5432:5432/tcp -p 0.0.0.0:5432:5432/tcp --rm -d -P -v rsschool-pgdata:/var/lib/postgresql/ --name rsschool-pgsql rsschool_pgsql
```


## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
