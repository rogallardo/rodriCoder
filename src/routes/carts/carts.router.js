import express from "express"
import { cartsController } from "../../controllers/carts/carts.controller.js"

export const routerCartView = express.Router()
//render cart
routerCartView.get('/:cid', cartsController.getCartById)
