# Movies application

This is a movies application made using NodeJS, Express, Knex, React, and Bootstrap.

### Running

Clone the repository and install the node modules by running the following script from the root directory of the project:
`cd client && npm i && cd ../server && npm i`

To run the server as well as the client run the following script from the root directory of the project:
`cd server && npm run start && cd ../server && npm run start`

And wait for the web app to start in a newly opened browser tab. If it doesn't open, visit the following URL:
`http://localhost:3000`

### API

REST API consisting of a Controller, Service, Repository, and Router. 

The **Router** calls the Controllers method corresponding to the needed route (getAllMovies and getMovie with GET, createNew with POST, etc.). Validation middleware from express-validator is used to get clean input parameters. 

The **Controller** is in charge of sending out different responses depending on the inputs and outputs from the Service. It's only task is to deal with HTTP requests, not with object creation or manipulation.

The **Service** completes and calculations needed between retrieving the data from the database (Repository) and determining which response to send out to the Router (Controller). In this example there is no need for any calculations, but this design pattern allows for easier extension, as well as somewhat future-proofing the design. It also promotes separation of concerns.

**Repository's** only duty is to get data from the database. The Service and Controller don't care how it's done, they just expect it to be correct. This allows to switch databases without needing to refactor a lot of objects.

Testing has been done using Jest. The testing is split into two suites, unit testing the Service object and black-box testing the API (Controller).

### Front-End

SPA (Single Page Application) made with React and styled using Bootstrap for React. The SPA aspect was achieved using BrowserRouter and Switch components. All API calls were made using axios.