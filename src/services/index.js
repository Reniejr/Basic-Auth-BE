const mainRoute = require("express").Router();

//ROUTES IMPORTS
const userRoute = require("./users");

//ENDPOINTS
mainRoute.use("/users", userRoute);

//EXPORTS
module.exports = mainRoute;
