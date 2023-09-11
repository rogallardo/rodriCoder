import express from 'express'
import { cartsController } from '../../controllers/API/carts.controller.api.js'
import { checkIsUserNotAdmin } from '../../middlewares/auth.js'
export const routerCarts = express.Router()

routerCarts.get('/:cid', cartsController.getCartById)
routerCarts.post('/', cartsController.createCart)
routerCarts.post('/:cid/products/:pid', checkIsUserNotAdmin, cartsController.addProductToCart)
routerCarts.put('/:cid/products/:pid', cartsController.updateProductQuantityInCart)
routerCarts.put('/:cid', cartsController.updateProductsInCart)
routerCarts.delete('/:cid/products/:pid', cartsController.deleteProductInCart)
routerCarts.delete('/:cid', cartsController.deleteAllProductsInCart)

routerCarts.post('/:cid/purchase', cartsController.purchase)




