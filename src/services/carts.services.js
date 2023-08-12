import { cartsModel } from "../DAO/mongodb/carts.model.js"
class CartService {
    async createCart(){
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        const newCart = {
            products: []
        }
        const createdCart = await cartsModel.create(newCart)
        if(createdCart){
            result.data = createdCart
            result.msg = 'Cart created'
        }else{
            result.error = true
            result.msg = 'Cannot create new cart, something went wrong'
        }
       return result
       
    }
    async getCart(id){
        const result = {
            error: false,
            msg: "",
            data: {}
        }
       const cart = await cartsModel.getById(id)
       let { products } = cart
       const docsNormalized = products.map(item => {  
        const plainItem = item.toObject()
        plainItem.product._id = plainItem.product._id.toString();
        plainItem._id = plainItem._id.toString();
        return plainItem
      });

       result.msg = "Cart sended",
       result.data = docsNormalized
       return result
    }
    async addProduct(cid, pid) {
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        const foundCart = await cartsModel.getById(cid)
        const productToAdd = {product: pid, quantity: 1}
        if(foundCart){
            let { products } = foundCart
            let foundProduct = products.find(product=> product.product._id.toString() == pid)
            if(foundProduct){
                foundProduct.quantity = foundProduct.quantity + 1
            }else{
                products.push(productToAdd)
            }            
            await cartsModel.update(cid, foundCart)
            result.msg = 'Product added'
            result.data = foundCart
        }else{
            result.error = true
            result.msg = 'Error trying to find cart'
        }
        return result
    }
    async updateCartProducts(newCartProducts, cid){
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        const foundCart = await cartsModel.getById(cid)
        if(foundCart){
            foundCart.products = newCartProducts
            await cartsModel.update(cid, foundCart)
            result.msg = 'Cart products updated'
            result.data = newCartProducts
        }else{
            result.error = true
            result.msg = 'Cannot update products cart'
        }
        return result 
    }
    async updateProductQuantity(updatedProduct) {
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        let { quantity, cid, pid } = updatedProduct
        const foundCart = await cartsModel.getById(cid)
        if(foundCart){
            let { products } = foundCart
            let foundProduct = products.find(product=> product.product == pid)           
            if(foundProduct){
                foundProduct.quantity = quantity
                await cartsModel.update(cid, foundCart)
                result.msg = 'Product quantity updated'
                result.data = foundCart
                return result
            }else{
                result.error = true
                result.msg = 'Error trying to find product in cart' 
                return result 
            }         
        }else{
            result.error = true
            result.msg = 'Error trying to find cart'
            return result
        }
        
    }
    async deleteProductInCart(cid, pid){
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        const foundCart = await cartsModel.getById(cid) 
        if(foundCart){
            let { products } = foundCart
            let foundProduct = products.find(product => product.product == pid)           
            if(foundProduct){
                foundCart.products = products.filter(product => product.product != pid)
                const deleteProductInCart = await cartsModel.update(cid, foundCart)
                result.msg = 'Product in cart deleted'
                result.data = foundCart
                return result
            }else{
                result.error = true
                result.msg = 'Error trying to find product in cart' 
                return result 
            }         
        }else{
            result.error = true
            result.msg = 'Error trying to find cart'
            return result
        }
    }
    async deleteAllProductsInCart(cid){
        const result = {
            error: false,
            msg: "",
            data: {}
        }
        const foundCart = await cartsModel.getById(cid) 
        if(foundCart){        
            foundCart.products = []
            await cartsModel.update(cid, foundCart)
            result.msg = 'The cart is empty now'
            result.data = foundCart
        }else{
            result.error = true
            result.msg = 'Error trying to find cart'
        }
        return result
    }
}
export const cartService = new CartService()