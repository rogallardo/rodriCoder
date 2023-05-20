import fs from'fs'
import path from'path'
import { JSONreader, JSONwriter } from './helpers/utils.js'



export default class ProductManager {
    constructor(){      
        this.products = []      
        this.path =  '/src/db/products.json'
    }

    async getProducts(){
        try {     
            this.products = await JSONreader(this.path) 
            return this.products
        }catch (error) {  
            await JSONwriter(this.path, this.products)
        }       
    }
    async getProductById(id){
        this.products = await JSONreader(this.path)    
        let foundedProduct = this.products.find(product=> product.id === id)       
        if(!foundedProduct){
            return []
        }
        return [foundedProduct]
    } 
    async idGenerator(){
        let id = this.products.length + 1
        const idCheck = this.products.some(x=> {x.id === id})
        if(idCheck){
            id = id + 1
        }
        return id
    }
    async addProduct(title, description, code, price, status, stock, category, thumbnail){
        //primero, leo el archivo y obtengo los productos
        this.products = await JSONreader(this.path)      
        //creo un objeto donde si la validacion es true, se guarda en el archivo, y si no, recibo el error
        let msg = {
            error: "",
            validation: true
        }
        //luego realizo una validacion
        const fieldValidation = (field)=>{
            msg.error = `Error, ${field} incomplete`
            msg.validation = false
        }
        const codeValidation =(code)=>{
            let newCode = this.products.find(product => product.code === code)
            if(newCode){
                msg.validation = false
                msg.error = 'The ingresed code already exists' 
                return msg         
            }else{
                return code
            }
        } 
        const id = await this.idGenerator()
        status = true
        title = title ??  fieldValidation('title')
        description = description ??  fieldValidation('description')
        price = price ??  fieldValidation('price')
        category = category ??  fieldValidation('thumbnail')
        status = status ??  fieldValidation('status')
        stock = stock ??  fieldValidation('stock')
        code =  codeValidation(code)
        
        //LUEGO DE VALIDAR, CREAMOS EL OBJETO DEL PRODUCTO Y LO AGREGAMOS AL ARRAY
        const newProduct = {id, title, description, code, price, status, stock, category, thumbnail}
        if (msg.validation){
            this.products.push(newProduct)
            await JSONwriter(this.path, this.products)
            return msg 
        } 
        return msg 
    } 
    async deleteById(id){
        this.products = await JSONreader(this.path)
        let foundId = this.products.some(x=> x.id === id)
        let msg = {
            deleted: null,
            error: ""
        }
        if(foundId){
            let newArray = this.products.filter(x=> x.id!= id)
            this.products = newArray
            await JSONwriter(this.path, this.products)
            msg.deleted = true
        }else{
            msg.deleted = false
            msg.error = 'cannot delete inexistent id'
        }
        return msg       
    }
    async updateProduct(id, title, description, code, price, status, stock, category, thumbnail){
        //lectura del json para actualizar
        this.products = await JSONreader(this.path)
        //buscamos el producto a actualizar pasando su id como argumento
        let productFound =  await this.getProductById(id)        
        //creo un objeto donde si la validacion es true, se guarda en el archivo, y si no, recibo el error
        let msg = {
            error: "",
            validation: true,
            data: {}     
        }
        //si no lo encuentro, guardo en el mensaje el detalle del error
        if(productFound.length === 0){
            msg.validation = false
            msg.error = 'product not found'  
        //si lo encuentro, actualizo el producto         
        }else{
            //validacion            
            const fieldValidation = (field)=>{
                msg.validation = false
                msg.error = `Error, ${field} incomplete`
            }
            const codeValidation =(code)=>{
                let newCode = this.products.find(product => product.code === code)
                if(newCode){
                    msg.validation = false
                    msg.error = 'The ingresed code already exists' 
                    return msg         
                }else{
                    return code
                }
            }      
            status = true
            title = title ??  fieldValidation('title')
            price = price ??  fieldValidation('price')
            category = category ??  fieldValidation('thumbnail')
            status = status ??  fieldValidation('status')
            stock = stock ??  fieldValidation('stock')
            code =  codeValidation(code)
            description = description ??  fieldValidation('description')      
            productFound = {          
                id: productFound[0].id,   
                title: title,
                description: description, 
                code: code, 
                price: price,
                status: status, 
                stock: stock, 
                category: category,
                thumbnail: thumbnail
            }
        }
        if (msg.validation){
            await this.deleteById(id)
            this.products = [...this.products, productFound]
            await JSONwriter(this.path, this.products)
            msg.data = productFound
         }            
        return msg          
    }
}





