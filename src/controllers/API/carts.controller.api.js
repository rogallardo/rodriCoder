import express from "express";
import passport from 'passport'

import { cartService } from '../../services/carts.services.js';
import { UserModel } from '../../DAO/mongodb/models/user.model.js';
export const cartsController = {
    getCartById: async (req, res)=>{
        try {
            let { cid } = req.params
            let { error, msg, data } = await cartService.getCartById(cid)
            if (error) {
                return res.status(401).json({status: msg, payload: data})
            }
            res.json({status: msg, payload: data})
        } catch (error) {
            return res.status(500).json({status: "Error in server: " + error, payload: {}})
        }
    },
    createCart: async (req, res)=>{
        try {
            
            // let {user} = req
            let {error, msg, data} = await cartService.createCart()
            // if (!req.user.cart){ 
            //     req.user.cart = data._id
               
            // }
            if (error) {
                return res.status(401).json({status: msg, payload: data})
            }
            res.json({status: msg, payload: data})
        } catch (error) {
            return res.status(500).json({status: "Error in server: " + error, payload: {}})
        }
    },
    addProductToCart: async (req, res)=>{
       try {
            let { cid, pid } = req.params
            let { user } = req
            let {error, msg, data} = await cartService.addProductToCart(cid, pid, user)
            if (error) {
                return res.status(401).json({status: msg, payload: data})
            }
            res.json({status: msg, payload: data})
        } catch (error) {
            return res.status(500).json({status: "Error in server: " + error, payload: {}})
        }
    },
    updateProductQuantityInCart: async (req, res)=>{
        try {
            let { cid, pid } = req.params
            let  quantity  =  Number(req.body.quantity)
            const productToUpdate = {cid, pid, quantity}
            const {error, msg, data} = await cartService.updateProductQuantityInCart(productToUpdate) 
            if (error) {
                return res.status(401).json({status: msg, payload: data})
            }
            res.json({status: msg, payload: data})
        } catch (error) {
            return res.status(500).json({status: "Error in server: " + error, payload: {}})
        } 
    },
    updateProductsInCart: async (req, res)=>{
        try {
            let { cid } = req.params
            let { products } = req.body
            let {error, msg, data} = await cartService.updateProductsInCart(products, cid)
            if (error) {
                return res.status(401).json({status: msg, payload: data})
            }
            res.json({status: msg, payload: data})
        } catch (error) {
            return res.status(500).json({status: "Error in server: " + error, payload: {}})
        } 
    },
    deleteProductInCart: async (req, res)=>{
        try {
            let { cid, pid } = req.params
            let {error, msg, data} = await cartService.deleteProductInCart(cid, pid)
            if(error){
                return res.status(401).json({status: msg, error, payload: data})
            }
            res.json({status: msg, error, payload: {}})
        } catch (error) {
            return res.status(500).json({status: "Error in server: " + error, payload: {}})
        }
    },
    deleteAllProductsInCart: async (req, res)=>{
        try {
            let { cid } = req.params
            let {error, msg, data} = await cartService.deleteAllProductsInCart(cid)
            if(error){
                return res.status(401).json({status: msg, payload: data})
            }
            res.json({status: msg, payload: data})
        } catch (error) {
            return res.status(500).json({status: "Error in server: " + error, payload: {}})
        }
    },
    purchase: async (req, res)=>{
        try {
            let { cid } = req.params
            let {user} = req
            let {error, msg, data} = await cartService.purchase(cid, user)
            // if (error) {
            //     return res.status(401).json({status: msg, payload: data})
            // }
            res.json({status: msg, payload: data, error})
        } catch (error) {
            return res.status(500).json({status: "Error in server aqui: " + error, payload: {}})
        }
    }
}