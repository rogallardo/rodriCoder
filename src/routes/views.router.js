import express from "express";
import { productService } from "../services/products.service.js";
import { cartService } from "../services/carts.services.js";
 export const routerProductsView = express.Router()
 export const routerCartView = express.Router()


routerProductsView.get('/', async (req, res)=>{
    let { page, limit, category, sort, order } = req.query
    const queries = {page, limit, category, sort, order}
    let {error, msg, data, paginate} = await productService.getProducts(queries)
    res.render('products', {data})
})

routerCartView.get('/:cid', async (req, res)=>{
    let {cid} = req.params
    let {error, msg, data} = await cartService.getCart(cid)   
    res.render('cart', {data})
})