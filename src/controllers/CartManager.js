import fs from'fs'
import path from'path'
import { JSONreader, JSONwriter } from './helpers/utils.js'


export default class CartManager {
    constructor(){
        this.carts = []
        this.path =  '/src/db/carts.json'
    }

    async idGenerator(){
    let id = this.carts.length + 1
    const idCheck = this.carts.some(x=> {x.id === id})
    if(idCheck){
        id = id + 1
    }
    return id
    }
    async getCart(idCart){
        let msg = {
            error: "",
            validation: true,
            data:[]
        }
        try {
            this.carts = await JSONreader(this.path) 
            let foundedCart = this.carts.find(cart=> cart.id === idCart)
            if(foundedCart){
                msg.data.push(foundedCart)
            }else{
                msg.error = `Cart not found with ID : ${idCart}`
            }
        } catch (error) {
            msg.error = 'Error reading JSON carts file'
        }
        
        return msg
    }
    async createNewCart (){
        let msg = {
            error: "",
            validation: true,
            data:[]
        }
    try {  
        this.carts = await JSONreader(this.path) 
        const id = await this.idGenerator()
        const products = []
        const newCart = {
            id: id,
            products: products
        }
        this.carts = [...this.carts, newCart]
        if(this.carts){
            await JSONwriter(this.path, this.carts)
            msg.data.push(newCart)
        }
        
    } catch (error) {
        msg.validation = false
        msg.error = error
    }
    return msg
    }  
    async addToCart (idCart, idProduct){
        //defino un objeto que sera utilizado para indicar el resultado de la operacion en app
            let msg = {
                error: "",
                validation: true,
                data:[]
            }
        //verifico que exista el producto mediante su id en el stock de productos
        
        const fileProductsParsed = await JSONreader('/src/db/products.json')     
        let foundedProduct = fileProductsParsed.find(product=> product.id === idProduct) 
        //si existe busco el id del carrito para agregarlo     
        if(foundedProduct){
            //leo el json de carritos
            this.carts = await JSONreader(this.path)
            //busco el carrito 
            let foundedCart = this.carts.find(cart=> cart.id === idCart) 
                //si existe el carrito, agrego el producto, pero primero verifico que el producto no exista en el carrito  
                if(foundedCart){
                    let foundProductInCart = foundedCart.products.find(product=> product.id === foundedProduct.id)
                    //si existe el producto en el carrito, sumo su cantidad
                    if(foundProductInCart){
                        foundProductInCart = {...foundProductInCart, quantity: foundProductInCart.quantity + 1}
                        //borro el producto de dicho carrito
                        let newProductsCart = foundedCart.products.filter(product=> product.id != idProduct)
                        //agrego el producto actualizado a la lista de productos de dicho carrito
                        newProductsCart.push(foundProductInCart)
                        //reemplazo los productos del carrito encontrado por la lista de productos actuales
                        foundedCart.products = newProductsCart
                        //elimino el carrito del array de carritos
                        let newCartList = this.carts.filter(cart=> cart.id != foundedCart.id)  
                        //y agrego carrito actualizado
                        newCartList = [...newCartList, foundedCart]
                        //actualizo la lista de carritos
                        this.carts = newCartList
                        //actualizo el JSON de carritos
                        await JSONwriter(this.path, this.carts)
                        //para evitar duplicados o inconvenientes, se crea el array vacio
                        msg.data = []
                        //retorno el carrito para mostrarlo al cliente
                        msg.data.push(foundedCart)
                        return msg
                    //si no existe el producto en el carrito    
                    }else{
                        //defino el objeto del nuevo producto agregado
                        let newProduct = {id:foundedProduct.id, quantity:1}
                        //lo agrego a los productos del carrito previamente encontrado
                        foundedCart.products.push(newProduct)                     
                        //elimino el carrito del array de carritos
                        let newCartList = this.carts.filter(cart=> cart.id != foundedCart.id)  
                        //y agrego carrito actualizado
                        newCartList = [...newCartList, foundedCart]
                        //actualizo la lista de carritos
                        this.carts = newCartList
                        await JSONwriter(this.path, this.carts)
                        //para evitar duplicados o inconvenientes, se crea el array vacio
                        msg.data = []
                        //se pushea la informacion
                        msg.data.push(foundedCart)  
                        return msg                   
                    }
                //si no existe el carrito     
                }else{
                    msg.error = 'Cart not found, please try another ID'
                    msg.validation = false
                    return msg
                }
        //si no existe el producto en el stock de productos    
        }else{
           msg.error = 'Product not found in stock, please try another ID'
           msg.validation = false
        }
        return msg
    }     
}
