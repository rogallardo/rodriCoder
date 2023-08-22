import express from 'express'
import { routerProducts } from './API/products.router.api.js'
import { routerCarts } from './API/carts.router.api.js'
import { routerAuth } from './API/auth.router.api.js'
import { routerProductsView } from './products/products.router.js'
import { routerCartView } from './carts/carts.router.js'
import { routerAuthView } from './auth/auth.router.js'
import { routerRealTimeProducts } from './realtime/realtime.router.js'
export const routerViews = express.Router()
export const routerAPI = express.Router()
//api
routerAPI.use('/products', routerProducts)
routerAPI.use('/carts', routerCarts)
routerAPI.use('/sessions', routerAuth)
//views
routerViews.use('/products/', routerProductsView)
routerViews.use('/cart', routerCartView)
routerViews.use('/', routerAuthView)
routerViews.use('/realtimeproducts', routerRealTimeProducts)