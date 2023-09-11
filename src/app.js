import express from 'express';
import path from 'path'
import { __dirname } from './utils/utils.js';
import { Server } from 'socket.io';
import { connectionMongo } from './utils/utils.js';
import handlebars from "express-handlebars";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { passportInit } from './config/passport.config.js';
import { routerAPI, routerViews } from './routes/index.router.js';
import { errorHandler } from './middlewares/errorHandler.js';


const app = express();
const port = 8080; 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
  store: MongoStore.create({mongoUrl: 'mongodb+srv://rodrigogastongallardo:CRPPTDfZPNoXaNbx@cluster0.50ffnbf.mongodb.net/ecommerce?retryWrites=true&w=majority', ttl: 7200}),
  secret: 'keyboard cat', 
  resave: false, 
  saveUninitialized: true
}));

//passport
passportInit()
app.use(passport.initialize());
app.use(passport.session());


//handlebars configuration
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");


//endpoints
//api
app.use('/api', routerAPI)
//views
app.use('/', routerViews)

app.get("*", (req, res) => {
  res.status(404).send("error, route not found");
});
//servidor
const httpServer = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

//mongoDB
connectionMongo()
//socket
const socketServer = new Server(httpServer)

//lo seteo a nivel global
app.set('socketServer', socketServer)

app.use(errorHandler)





