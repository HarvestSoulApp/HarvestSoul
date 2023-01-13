// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

hbs.registerPartials(__dirname + "/views/partials");
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "harvestSoulApp";

app.locals.appTitle = `${capitalize(projectName)}`;

app.use((req, res, next) => {
    app.locals.currentUser = req.session.currentUser
    console.log(req.session, app.locals)
    next()
})


// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/profile", userRoutes);

const eventRoutes = require("./routes/event.routes");
app.use("/event", eventRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
