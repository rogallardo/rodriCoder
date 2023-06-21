import express from 'express';
import path from 'path'
import { __dirname } from './utils/utils.js';
import { Server } from 'socket.io';
import { connectionMongo } from './utils/utils.js';
import { routerProducts } from './routes/products.router.js';
import { routerCarts} from './routes/carts.router.js';
//import { routerRealTimeProducts } from './routes/realTimeProducts.router.js';
import handlebars from "express-handlebars";

const app = express();
const port = 8080; 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

//handlebars configuration
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");

//endpoints

app.use('/api/products/', routerProducts)
app.use('/api/carts/', routerCarts)
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





