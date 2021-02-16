const express = require("express"),
  server = require("express")(),
  listEndpoints = require("express-list-endpoints"),
  cors = require("cors"),
  mongoose = require("mongoose");

//SERVICES IMPORTS
const mainRoute = require("./services");

//ERRORS HANDLING IMPORTS
const {
  notFound,
  unAuthorized,
  forbidden,
  badRequest,
  genericError,
} = require("./utilites/errorsHandling");

//MAIN
const PORT = process.env.PORT || 5001,
  accessOrigin =
    process.env.NODE_ENV === "production"
      ? [process.env.FE_URL_DEV, process.env.FE_URL_PROD]
      : [process.env.FE_URL_DEV],
  corsOptions = {
    origin: function (origin, callback) {
      accessOrigin.indexOf(origin) !== -1
        ? callback(null, true)
        : callback(new Error("Invalid origin - Check origins"));
    },
  };

//MIDDLEWARE
server.use(express.json());
server.use(cors(corsOptions));

//ROUTES
server.get("/", async (req, res, next) => {
  try {
    res.send("<h1>AUTH SERVER EXAMPLE</h1>");
  } catch (error) {
    next(error);
  }
});
server.use("/", mainRoute);

//ERRORS ROUTES
server.use(notFound);
server.use(unAuthorized);
server.use(forbidden);
server.use(badRequest);
server.use(genericError);

//CONSOLE LOGS
console.log(listEndpoints(server));

//MONGO CONNECTION
mongoose
  .connect(process.env.MONGODB_CONNECTION, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  //SERVER LISTEN
  .then(
    server.listen(PORT, () => {
      process.env.NODE_ENV === "production"
        ? console.log(`Server running ONLINE on : ${PORT}`)
        : console.log(`Server runnning OFFLINE on : http://localhost:${PORT}`);
    })
  )
  .catch((errors) => console.log(errors));
