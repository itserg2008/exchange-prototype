# Exchange prototype

The application consists of several components working together:

- Single-page application implementing exchange's web UI using Angular
- Backend service application based on Ruby on Rails
- PostgreSql database for storing exchange transactions data
- Nginx used as a host for serving Angular application and routing api requests

## How to run

docker-compose --env-file env.dev up --build

## Container parameters

- BTC_FUNDING_PRIVATE_KEY - private key that stores BTC funds
- AUTH_USERNAME - Basic authentication username
- AUTH_PASSWORD - Basic authentication password
- POSTGRES_PASSWORD - default postgres password
- DB_USER - user name for accessing the exchange database
- DB_PASSWORD - password for accessing the exchange database
- DB_DATABASE - exchange database name
- DB_HOST=localhost - database address

Once all the containers are started, please open [http://localhost](http://localhost)
