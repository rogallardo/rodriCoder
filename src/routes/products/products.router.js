import express from "express";


import { productService } from "../../services/products.service.js";
import { checkIsAdmin, checkUser } from "../../middlewares/auth.js";

export const routerProductsView = express.Router()

//render products
routerProductsView.get('/', checkUser, checkIsAdmin, async (req, res)=>{
    let {firstName, lastName, email, isAdmin} = req.session.user
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