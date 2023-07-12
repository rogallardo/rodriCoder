import express from 'express';
import { cartService } from '../../services/carts.services.js';
export const cartsController = {
    getCartById: async (req, res)=>{
        let { cid } = req.params        
        let {error, msg, data}= await cartService.getCart(cid)
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
    },
    createCart: async (req, res)=>{
        let {error, msg, data} = await cartService.createCart()        
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
    },
    addProductToCart: async (req, res)=>{
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
    },
    updateProductQuantityInCart: async (req, res)=>{
        let { cid, pid } = req.params
        let  quantity  =  Number(req.body.quantity)
        const updatedProduct = {cid, pid, quantity}
       const {error, msg, data} = await cartService.updateProductQuantity(updatedProduct)
       return res.json({
        error,
        msg,
        data
       })
       
    },
    updateProductsInCart: async (req, res)=>{
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
     
     },
     deleteProductInCart: async (req, res)=>{
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
     
    },
    deleteAllProductsInCart: async (req, res)=>{
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
 
    }
}