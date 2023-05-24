import express from 'express';
import path from 'path'
import handlebars from "express-handlebars";
import { routerProducts } from './routes/routerProducts.js';
import { routerCarts} from './routes/routerCarts.js';
import { __dirname } from './utils.js';
import { routerRealTimeProducts } from './routes/routerRealTimeProducts.js';
import { Server } from 'socket.io';

const app = express();
const port = 8080;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

//handlebars configuration
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//endpoints

app.use('/api/products/', routerProducts)
app.use('/api/carts/', routerCarts)
app.use('/api/realtimeproducts/', routerRealTimeProducts)

app.get("*", (req, res) => {
  res.status(404).send("error, route not found");
});
//servidor
const httpServer = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

//socket
const socketServer = new Server(httpServer)

//lo seteo a nivel global
app.set('socketServer', socketServer)





