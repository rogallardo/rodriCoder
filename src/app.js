import express from 'express';
import { routerProducts } from './routes/routerProducts.js';
import { routerCarts} from './routes/routerCarts.js';
import CartManager from './controllers/CartManager.js';


const app = express();
const port = 8080;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const c = new CartManager()
c.addToCart(3,6)

app.use('/api/products/', routerProducts)
app.use('/api/carts/', routerCarts)

app.get("*", (req, res) => {
  res.status(404).send("error, route not found");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});