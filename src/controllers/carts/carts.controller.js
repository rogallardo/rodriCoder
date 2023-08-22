import express from "express";
import passport from 'passport'

import { cartService } from '../../services/carts.services.js';
import { UserModel } from '../../DAO/mongodb/models/user.model.js';
import { CartHandlebarsDTO } from "../../DTO/cart.handlebars.dto.js";
export const cartsController = {
    getCartById: async (req, res)=>{
        try {
            let { cid } = req.params
            let { error, msg, data } = await cartService.getCartById(cid)
            const cartDTO = new CartHandlebarsDTO(data)
            if (error) {
                return res.status(401).json({status: msg, payload: {}})
            }
            res.render('cart', {cartDTO})
        } catch (error) {
            return res.status(500).json({status: "Error in server: " + error, payload: {}})
        }
    }   
}