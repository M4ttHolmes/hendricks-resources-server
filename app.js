const Express = require('express');
const app = Express();
require("dotenv").config();
const dbConnection = require("./db");

app.use(require("./middleware/headers"));
app.use(Express.json());


const controllers = require("./controllers");

app.use("/resource", controllers.resourceController);
app.use("/user", controllers.userController);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: App is listening on ${process.env.PORT}.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });