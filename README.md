On this branch is the baseline version of the application. For the backend microservices I have used `Express.js`, whereas for the database I have used `Postgres`. The application supports CRUD operations for all models specified in the task, that being:
* Invoice model (alias: invoice)
* InvoiceLine model (alias: invoiceLine)
* User model (alias: user)
* Membership model (alias: membership)

Each route consists of the name of the model and the desired operation:
* `/getOne/:id` - retrieves record by id
* `/getAll/` - retrieves everything in the database
* `/create/` - creates new record
* `/updateOne/:id` - updates given record
* `/deleteOne/:id` - removes given record

A request is constructed from the alias and the desired operation
```http request
GET http://localhost:3000/user/getAll

GET http://localhost:3000/membership/getOne/{{id}}

PUT http://localhost:3000/invoice/updateOne/{{id}}

DELETE http://localhost:3000/invoiceLine/{{id}}
```
The endpoint for checking-in is on mapping `http://localhost:3000/checkIn/:userId/`. It is implemented using POST mapping, where we can send list of items which will be added as invoice lines.

Sample data:
* Valid membership request body
```json
{
    "status" : "Active",
    "start_date" : "2023-03-28",
    "end_date" : "2023-05-17",
    "credits": 5,
    "userId" : 1
}
```
* Valid user request body
```json
{
	"name" : "Sebastian",
	"email" : "sebastian@gmail.com",
	"phone" : "+31 12 34 56 789"
}
```
* Valid invoice request body
```json
{
  "date" : "2023-05-17",
  "status" : "Outstanding",
  "description" : "Invoice for May",
  "amount" : 123,
  "userId" : 1
}
```
* Valid invoiceLine request body
```json
{
  "description" : "Protein bar",
  "amount" : 2,
  "invoiceId" : 1
}
```
To test the checkIn functionality you need to send POST request
```http request
POST http://localhost:3000/checkIn/{{userId}}
```
```json
{
"items":[ {
        "description" : "protein bars",
        "amount" : 5
    }, {
        "description" : "milk shakes",
        "amount" : 10
    }]
}
```
The main application is inside `src/` folder. The tests are inside `__tests__`.

To run both the application and the database execute:
```shell
docker-compose up
```
If you only want to rebuild the containers execute:
```shell
docker-compose up --build
```
To only run the database(add -d to run in the background):
```shell
docker-compose up applicationDB
```
The application binds port `3000` in local machine to port `3000` in docker image. For the database port `5432` is bound to port `5432`.
To run the app ports 3000 and 5432 should preferably be free on the local machine.

Tests are also included, however for the test suite [checkInSystemTest.spec.js](__tests__%2FcheckInTests%2FcheckInSystemTest.spec.js) Docker must be available and running, since the tests use it.
By executing the following command you run the tests and generate code coverage report in the same time. The report is saved in the `
coverage/` folder.
```shell
npm test
```

To run the application alone:
```shell
npm run dev
```
For the application I have used the following dependencies:
* Express.js - used to create the application in general
* Dotenv - used for setting up environment variables on local machine
* PG - Non-blocking PostgresSQL client for Node.js
* Sequelize - Easy interface for setting up database models and interacting with the database
* Jest - Used for testing, very powerful for mocking and creating tests
* Supertest - Used for integration tests mainly to simulate HTTP 

Test coverage is almost 100 %, with a good combination of unit and integration tests 