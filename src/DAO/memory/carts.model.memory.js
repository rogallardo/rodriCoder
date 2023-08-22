import { __dirname } from "../../utils/utils.js"
import { JSONreader, JSONwriter} from "./helpers/helpers.js"


export class CartsModel {
    constructor(){      
        this.carts = []      
        this.path =  '../DAO/memory/db/carts.json'
    }

    async idGenerator(){
    let id = this.carts.length + 1
    const idCheck = this.carts.some(x=> {x.id === id})
    if(idCheck){
        id = id + 1
    }
    return id
    }
    async getById(cid){
        try {
            const id = Number(cid)
            this.carts = await JSONreader(this.path) 
            let cart = this.carts.find(cart=> cart.id === id)
            return cart
        } catch (error) {
            return null        
        }
    }
    async create (newCart){
        try {  
            this.carts = await JSONreader(this.path) 
            const id = await this.idGenerator()
            const newCartWithId = {id: id, ...newCart}
            this.carts = [...this.carts, newCartWithId]
            await JSONwriter(this.path, this.carts)
            return this.carts
        
        } catch (error) {
            throw Error ('Error writing JSON file ' + error);  
        }
    }  
    async update (cid, cartToUpdate){
        try {
            const cartId = Number(cid)
            this.carts = await JSONreader(this.path)
            let cartFound = this.carts.findIndex(cart => cart.id === cartId)
            const productsFormatted = cartToUpdate.products.map((product)=> {
                const formatedProduct = {product: {_id: Number(product.product._id)}, quantity: product.quantity}
                return formatedProduct
            })
            cartToUpdate.products = productsFormatted
            this.carts[cartFound] = cartToUpdate
            await JSONwriter(this.path, this.carts)
            const updatedCart = await this.getById(cartId)
            return  updatedCart  
        } catch (error) {
            const updatedCart = null
           return updatedCart
        }  
    }
    
}
export const cartsModel = new CartsModel()