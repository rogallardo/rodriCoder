import express from "express";
import { productService } from "../services/products.service.js";
import { cartService } from "../services/carts.services.js";
import { checkUser } from "../middlewares/auth.js";

 export const routerProductsView = express.Router()
 export const routerCartView = express.Router()
 export const routerAuthView = express.Router()


//render products
routerProductsView.get('/', checkUser, async (req, res)=>{
    let {firstName, lastName, email, isAdmin} = req.session
    const user = {firstName, lastName, email, isAdmin}
    const originalURL = req.originalUrl
    let { page, limit, category, sort, order } = req.query
    const queries = {page, limit, category, sort, order, originalURL }
    let {error, msg, data, paginate} = await productService.getProducts(queries)  
    paginate.prevLink = paginate.hasPrevPage ? paginate.prevLink.replace('/api', '') : paginate.prevLink
    paginate.nextLink = paginate.hasNextPage ? paginate.nextLink.replace('/api', '') : paginate.nextLink
    if(page){
        paginate.prevLink = paginate.hasPrevPage ? originalURL.replace(`?page=${page}`, `?page=${paginate.prevPage}`) : null
        paginate.nextLink = paginate.hasNextPage ? originalURL.replace(`?page=${page}`, `?page=${paginate.nextPage}`) : null
    }
    
    res.render('products', {data, paginate, user})

})
routerProductsView.get('/:pid', async (req, res)=>{
    let { pid } = req.params
    let {error, msg, data} = await productService.getProductById(pid)
    res.render('productDetail', {data})
})
//render cart
routerCartView.get('/:cid', async (req, res)=>{
    let {cid} = req.params
    let {error, msg, data} = await cartService.getCart(cid)   
    res.render('cart', {data})
})
//render register
routerAuthView.get('/register', (req, res)=>{
    res.render('register')
})
//render login
routerAuthView.get('/login', (req, res)=>{
    res.render('login')
})

