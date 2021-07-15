# Movies application

This is a movies application made using NodeJS, Express, Knex, React, and Bootstrap.

### Running

Clone the repository and install the node modules by running the following command from the root directory of the project:

`npm run install`

For the server to connect to the database, create a `.env` file in the `server` directory with the database connection string as `DB_CONNECTION`.

After the installation is complete you can run the servers. The SPA server and the API server need to be run in separate terminals. Run the API server with the following command:

`cd server && npm run start`

Open another terminal, and enter the following command to run the SPA server:

`cd client && npm run start`

And wait for the web app to start in a newly opened browser tab. If it doesn't open, visit the following URL:
`http://localhost:3000`

### API

REST API consisting of a Controller, Service, Repository, and Router. 

The **Router** calls the Controllers method corresponding to the needed route (getAllMovies and getMovie with GET, createNew with POST, etc.). Validation middleware from express-validator is used to get clean input parameters. 

The **Controller** is in charge of sending out different responses depending on the inputs and outputs from the Service. It's only task is to deal with HTTP requests, not with object creation or manipulation.

The **Service** completes and calculations needed between retrieving the data from the database (Repository) and determining which response to send out to the Router (Controller). In this example there is no need for any calculations, but this design pattern allows for easier extension, as well as somewhat future-proofing the design. It also promotes separation of concerns.

**Repository's** only duty is to get data from the database. The Service and Controller don't care how it's done, they just expect it to be correct. This allows to switch databases without needing to refactor a lot of objects.

Testing has been done using Jest. The testing is split into two suites, unit testing the Service object and black-box testing the API (Controller).

Postgres is used for data storage. It's hosted on ElephantSQL and connected remotely.

### Front-End

SPA (Single Page Application) made with React and styled using Bootstrap for React. The SPA aspect was achieved using BrowserRouter and Switch components. All API calls were made using axios.