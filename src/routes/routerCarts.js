import express from 'express'
import CartManager from '../controllers/CartManager.js'

export const routerCarts = express.Router()
const cart = new CartManager()
routerCarts.get('/:cid', async (req, res)=>{
    const idCart = Number(req.params.cid)
    try {
        const getCart = await cart.getCart(idCart)
        if(getCart.data.length > 0){
            res.json({
            status: 'success',
            msg: 'cart sended',
            data: getCart.data 
        })
        }else{
            res.status(404).json({
                status: 'error not found',
                msg: getCart.error,
                data: {}
            }) 
        }
        
    } catch (error) {
        res.status(404).json({
            status: 'error not found',
            msg: getCart.error,
            data: {}
        }) 
    }
})
routerCarts.post('/', async (req, res)=>{
    try {
        const creatingCart = await cart.createNewCart()
        if(creatingCart.data.length > 0){
            return res.json({
                status: 'success',
                msg: 'cart created',
                data: creatingCart.data         
            })
        }
       
    } catch (error) {
        return res.status(404).json({
            status: 'error',
            msg: 'cannot add new cart',
            data: {} 
        })
    }
})
routerCarts.post('/:cid/products/:pid', async (req, res)=>{
    const cartId = Number(req.params.cid)
    const productId = Number(req.params.pid)
    try {
        const addingToCart = await cart.addToCart(cartId, productId)
       
        if(addingToCart.data.length > 0){
            return res.json({
                status: 'success',
                msg: 'product added to cart',
                data: addingToCart.data        
            })
        }else{
            return res.json({
                status: 'error',
                msg: addingToCart.error,
                data: addingToCart.data        
            })
        }
       
    } catch (error) {
        return res.status(404).json({
            status: 'error',
            msg: 'cannot add to cart',
            data: {} 
        })
    }
})