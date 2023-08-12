import express from "express";
import { productsController } from "../../controllers/API/products.controller.js";
export const routerProducts = express.Router()

routerProducts.get('/', productsController.getProducts)
routerProducts.get('/:pid', productsController.getProductById)
routerProducts.post("/", productsController.createProduct)
routerProducts.put('/:pid', productsController.updateProduct)
routerProducts.delete('/:pid', productsController.deleteProduct)