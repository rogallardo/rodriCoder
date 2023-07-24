import express from 'express';
import path from 'path'
import { __dirname } from './utils/utils.js';
import { Server } from 'socket.io';
import { connectionMongo } from './utils/utils.js';
import { routerProducts } from './routes/API/products.router.js';
import { routerCarts} from './routes/API/carts.router.js';
import { routerAuth }from './routes/API/auth.router.js'
import { routerProductsView, routerAuthView, routerCartView } from './routes/view/views.router.js'
import handlebars from "express-handlebars";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { passportInit } from './config/passport.config.js';


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
app.use('/api/products/', routerProducts)
app.use('/api/carts/', routerCarts)
app.use('/api/sessions/', routerAuth)
//views
app.use('/products', routerProductsView)
app.use('/cart', routerCartView)
app.use('/', routerAuthView)


//app.use('/api/realtimeproducts/', routerRealTimeProducts)

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






