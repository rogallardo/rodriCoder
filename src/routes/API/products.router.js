import express from "express";
import { productsController } from "../../controllers/API/products.controller.js";
export const routerProducts = express.Router()

routerProducts.get('/', productsController.getProducts)
routerProducts.get('/:id', productsController.getProductById)
routerProducts.post("/", productsController.addProduct)
routerProducts.put('/:id', productsController.updateProduct)
routerProducts.delete('/:id', productsController.deleteProduct)