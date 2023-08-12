import { __dirname } from "../../utils/utils.js"
import { JSONreader, JSONwriter} from "./helpers/helpers.js"

export class ProductsModel {
    constructor(){      
        this.products = []      
        this.path =  '../DAO/memory/db/products.json'
    }

    async getAll(){
        try {     
            this.products = await JSONreader(this.path)
            return this.products
        }catch (error) {  
            await JSONwriter(this.path, this.products)
        }       
    }
    async getById(pid){
        try{
            this.products = await JSONreader(this.path)  
            const id = Number(pid)
            let result = this.products.find(product=> product.id === id)
            return result
        }catch(error){
            return result = null
        }
    } 
    async idGenerator(){
        let id = this.products.length + 1
        const idCheck = this.products.some(x=> {x.id === id})
        if(idCheck){
            id = id + 1
        }
        return id
    }
    async create(newProduct){  
            try {
                this.products = await JSONreader(this.path) 
                const id = await this.idGenerator()
                const productToCreate = {id, ...newProduct}
                this.products.push(productToCreate)
                await JSONwriter(this.path, this.products)
                const createdProduct = await this.getById(id)
                return createdProduct 
            } catch (error) {
                const createdProduct = null
                return createdProduct 
            }
    } 
    async deleteById(pid){
        try {
            const id = Number(pid)
            this.products = await JSONreader(this.path)
            let foundId = this.products.find(x=> x.id === id)
            if(foundId){
                let newArray = this.products.filter(x=> x.id != id)
                this.products = newArray
                await JSONwriter(this.path, this.products) 
            return foundId
            }
        } catch (error) {
            return foundId = null
        }
         
    }
    async update(pid, productToUpdate){
        try {
            const id = Number(pid)
            productToUpdate = {id: id, ...productToUpdate}
            this.products = await JSONreader(this.path)
            let productFound = this.products.findIndex(product => product.id === id)
            this.products[productFound] = productToUpdate
            await JSONwriter(this.path, this.products)
            const updatedProduct = await this.getById(id)
            return  updatedProduct  
        } catch (error) {
            const updatedProduct = null
           return updatedProduct
        }   
    }
}


export const productsModel = new ProductsModel()


