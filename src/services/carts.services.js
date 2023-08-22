import { productService } from "./products.service.js"

// import { productsModel } from "../DAO/memory/products.model.memory.js";
// import { cartsModel } from "../DAO/memory/carts.model.memory.js";
import { cartsModel } from "../DAO/mongodb/carts.model.js"
import { productsModel } from "../DAO/mongodb/products.model.js"
import { ticketsService } from "./tickets.service.js"

class CartService {
    result ={
        error: false,
        msg: "",
        data: {}
    }
    async getCartById(cid){
        try {
            const cart = await cartsModel.getById(cid)
            let { products } = cart
            if(cart.id.length > 10){
                products = products.map(item => {  
                    const plainItem = item.toObject()
                    plainItem.product._id = plainItem.product._id.toString();
                    plainItem._id = plainItem._id.toString();
                    return plainItem
                });
            }  
            this.result.msg = "Success: Cart sended",
            this.result.data = cart
            return this.result  
        } catch (error) {
            this.result.error = true
            this.result.msg = "Cannot get cart : "+ error,
            this.result.data = {}
            return this.result 
        }
        
     }
    async createCart(){
        try{
            const newCart = {products: []}
            const createdCart = await cartsModel.create(newCart)
            this.result.data = createdCart
            this.result.msg = 'Cart created'
            return this.result
        }catch(error){
            this.result.error = true
            this.result.msg = 'Cannot create new cart, something went wrong'
            return this.result
        }       
    }
    async addProductToCart(cid, pid) {
        try {
            const foundCart = await cartsModel.getById(cid)
            const foundProduct = await productsModel.getById(pid)
            if(foundProduct){
                let { products } = foundCart
                const  productAlreadyInCart = products.find(product=> product.product._id.toString() == pid)
                if(productAlreadyInCart){
                    productAlreadyInCart.quantity = productAlreadyInCart.quantity + 1
                }else{
                    const productToAdd = {product: {_id: pid}, quantity: 1}
                    products.push(productToAdd)
                } 
            }else{
                this.result.error = true
                this.result.msg = 'Product is not available or doesnt exists'
                this.result.data = {}
                return this.result
            }   
            await cartsModel.update(cid, foundCart)
            this.result.msg = 'Product added'
            this.result.data = foundCart
            return this.result
        } catch (error) {
            this.result.error = true
            this.result.msg = 'Error trying to find cart: ' + error
            this.result.data = {}
            return this.result
        }
    }
    async updateProductsInCart(newCartProducts, cid){
        try {
            const foundCart = await cartsModel.getById(cid)
            foundCart.products = newCartProducts
            await cartsModel.update(cid, foundCart)
            this.result.msg = 'Cart products updated'
            this.result.data = newCartProducts
            return this.result 
        } catch (error) {
            this.result.error = true
            this.result.msg = 'Cannot update products cart: ' + error
            return this.result 
        }
    }
    async updateProductQuantityInCart(productToUpdate) {
        try {
            let { quantity, cid, pid } = productToUpdate
            const updatedCart = await cartsModel.updateQuantity(cid, pid, quantity)
            const { products}  = updatedCart
            const updatedProduct = products.find(product => product.product.toString() === pid)
            this.result.msg = 'Success: Product quantity updated'
            this.result.data = updatedProduct
            return this.result    
        } catch (error) {
            this.result.error = true
            this.result.msg = 'Error trying to update product in cart: ' + error
            this.result.data = {}
            return this.result 
        }   
    }
    async deleteProductInCart(cid, pid){
        try {
            const foundCart = await cartsModel.getById(cid)
            let { products } = foundCart
            const updatedProducts = products.filter(product => product.product._id.toString() != pid)
            foundCart.products = updatedProducts
            await cartsModel.update(cid, foundCart) 
            const updatedCart = await cartsModel.getById(cid)
            this.result.msg = 'Product in cart deleted'
            this.result.data = updatedCart
            return this.result
        } catch (error) {
            this.result.error = true
            this.result.msg = 'Error trying to delete in cart' 
            return this.result
        }
    }
    async deleteAllProductsInCart(cid){   
        try {
            const foundCart = await cartsModel.getById(cid)      
            foundCart.products = []
            await cartsModel.update(cid, foundCart)
            this.result.msg = 'The cart is empty now'
            this.result.data = foundCart
            return this.result
        } catch (error) {
            this.result.error = true
            this.result.msg = 'Error trying to get the cart: ' + error
            return this.result
        }
    }
    async purchase(cid, user){
        try {
            const { email } = user
            const cart = await cartsModel.getById(cid)
            let { products } = cart
            const productsStockNull = products.filter(item =>  item.quantity > item.product.stock)
            const productsStockTrue = products.filter(item => item.quantity <= item.product.stock)
            if(!products.length){
                this.result.data = products
                this.result.msg = 'Your cart is empty'
            }
            if(!productsStockTrue.length && productsStockNull.length){
                this.result.data = productsStockNull
                this.result.msg = 'No stock, please check pending products'
            }
            if(productsStockTrue.length){ 
                productsStockTrue.map(async (item) => {
                    const updatedItem = {
                        title: item.product.title,
                        description: item.product.description,
                        code: item.product.code,
                        price: item.product.price,
                        status: item.product.status,
                        stock: item.product.stock - item.quantity,
                        category: item.product.category,
                        thumbnail:item.product.thumbnail
                    }
                    await productService.updateProduct(item.product._id, updatedItem)
                })
                await this.updateProductsInCart(productsStockNull, cid)   
                const { data } = await ticketsService.createTicket(email, productsStockTrue)
                this.result.msg = 'Compra realizada'
                this.result.data = {ticket: data, pending_products: productsStockNull}    
            }
            return this.result
        } catch (error) {
            this.result.error = true
            this.result.msg = "Cannot get cart : "+ error,
            this.result.data = {}
            return this.result 
        }
    }
}
export const cartService = new CartService()