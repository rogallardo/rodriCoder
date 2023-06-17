import express from 'express'
import { cartService } from '../services/carts.services.js'
export const routerCarts = express.Router()

routerCarts.get('/:cid', async (req, res)=>{
let { cid } = req.params
const cart = await cartService.getCart(cid)
return res.json({
    data: cart
})
})
routerCarts.post('/:cid/products/:pid', async (req, res)=>{
    let { cid, pid } = req.params
    let {error, msg, data} = await cartService.addProduct(cid, pid)
    if(error){
        return res.status(500).json({
            error,
            msg,
            data
        })
    }
    return res.json({
        error,
        msg,
        data
    })
})
routerCarts.put('/:cid/products/:pid', async (req, res)=>{
    let { cid, pid } = req.params
    let  quantity  =  Number(req.body.quantity)
    const updatedProduct = {cid, pid, quantity}
   const {error, msg, data} = await cartService.updateProductQuantity(updatedProduct)
   return res.json({
    error,
    msg,
    data
   })
   
})
routerCarts.put('/:cid', async (req, res)=>{
   let { cid } = req.params
   let { products } = req.body
   let {error, msg, data} = await cartService.updateCartProducts(products, cid)
   if(error){
    return res.status(500).json({
        error,
        msg,
        data
    })
   }
   return res.json({
    error,
    msg,
    data
   })

})
routerCarts.delete('/:cid/products/:pid', async (req, res)=>{
    let { cid, pid } = req.params
    let {error, msg, data} = await cartService.deleteProductInCart(cid, pid)
    if(error){
     return res.status(500).json({
         error,
         msg,
         data
     })
    }
    return res.json({
     error,
     msg,
     data
    })
 
})
routerCarts.delete('/:cid', async (req, res)=>{
    let { cid, pid } = req.params
    let {error, msg, data} = await cartService.deleteAllProductsInCart(cid, pid)
    if(error){
     return res.status(500).json({
         error,
         msg,
         data
     })
    }
    return res.json({
     error,
     msg,
     data
    })
 
})
