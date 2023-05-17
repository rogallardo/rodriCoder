import fs from'fs'
import path from'path'



export default class ProductManager {
    constructor(){
        
        this.products = []
        
        this.path =  '/src/db/products.json'

    }
    async getProducts(){
         try {
            const file =  await fs.promises.readFile(path.resolve()  + this.path,'utf-8')
            const fileParsed = JSON.parse(file)     
            this.products = fileParsed
            return this.products
         } catch (error) {  
            const productsJSON = JSON.stringify(this.products)
            fs.writeFileSync('./src/db/products.json', productsJSON)
         }
        
    }
   async getProductById(id){
        const file =  await fs.promises.readFile(path.resolve()  + this.path,'utf-8')
        const fileParsed = JSON.parse(file)
        this.products = fileParsed
       
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
    async addProduct(
        title, // “producto prueba” 
        description, //”Este es un producto prueba”
        code, //abc123”,
        price, //200,
        status, 
        stock, //25
        category,//electro
        thumbnail, //”Sin imagen”
    ){
        //primero, leo el archivo y obtengo los productos
       const file =  await fs.promises.readFile(path.resolve()  + this.path,'utf-8')
        const fileParsed = JSON.parse(file)
        this.products = fileParsed
        
        //luego realizo una validacion
        //creo un objeto donde si la validacion es true, se guarda en el archivo, y si no, recibo el error
        let msg = {
            error: "",
            validation: true
        }
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
        const newProduct = {
        id, 
        title, // “producto prueba” 
        description, //”Este es un producto prueba”
        code, //abc123”,
        price, //200,
        status, 
        stock, //25
        category,//electro
        thumbnail}
        if (msg.validation){
            this.products.push(newProduct)
            const productsToJSON = JSON.stringify(this.products)
            await fs.promises.writeFile('./src/db/products.json', productsToJSON)
            return msg 
        } 
        return msg 
    } 
    async deleteById(id){
        const file =  await fs.promises.readFile(path.resolve()  + this.path,'utf-8')
        const fileParsed = JSON.parse(file)
        this.products = fileParsed
        let foundId = this.products.some(x=> x.id === id)
        let msg = {
            deleted: null,
            error: ""
        }
        if(foundId){
            let newArray = this.products.filter(x=> x.id!= id)
            this.products = newArray
            const productsToJSON = JSON.stringify(this.products)
            await fs.promises.writeFile('./src/db/products.json', productsToJSON)
            msg.deleted = true
        }else{
            msg.deleted = false
            msg.error = 'cannot delete inexistent id'
        }
        return msg
      
       
    }
   async updateProduct(
        id,
        title, // “producto prueba” 
        description, //”Este es un producto prueba”
        code, //abc123”,
        price, //200,
        status, 
        stock, //25
        category,//electro
        thumbnail, //”Sin imagen”
   ){
    //SE LEERA EL ARCHIVO JSON Y SE PARSEARA PARA PODER TRABAJAR CON EL ARRAY
        const file = await fs.promises.readFile(path.resolve() + this.path, 'utf-8')
        const fileParsed = JSON.parse(file)
        this.products = fileParsed
        //BUSCAMOS EL ID DEL PRODUCTO A ACTUALIZAR
        let productFound =  await this.getProductById(id)
        
         //creo un objeto donde si la validacion es true, se guarda en el archivo, y si no, recibo el error
        let msg = {
            error: "",
            validation: true,
            data: {}     
        }
        //SI LO ENCUENTRO PROCEDO CON LA VALIDACION DE LOS INPUTS
        if(productFound.length === 0){
            console.log('me estoy ejecutando')
            msg.validation = false
            msg.error = 'product not found'  
           
        }else{
            productFound = {
            
                id: productFound[0].id,   
                title: title,
                description: description, 
                code: code, 
                price: price,
                status: status, 
                stock: stock, 
                category: category,
                thumbnail: thumbnail}
                //VALIDACION
               
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
             
             //LUEGO DE VALIDAR, CREAMOS EL OBJETO DEL PRODUCTO Y LO AGREGAMOS AL ARRAY
        }
        if (msg.validation){
            await this.deleteById(id)
             this.products = [...this.products, productFound]
             const productsToJSON = JSON.stringify(this.products)
             await fs.promises.writeFile('./src/db/products.json', productsToJSON)
             msg.data = productFound
         }            
        return msg          
    }
}

const producto = new ProductManager()

//PARA TESTEAR, DESCOMENTAR UNA LINEA A LA VEZ, PASANDO A LA SIGUIENTE SE DEBERA COMENTAR LA ANTERIOR//
//TENER EN CUENTA: INSTALAR EL PACKAGE.JSON DE NODE MEDIANTE NPM INIT -Y

//OBTENER TODOS LOS PRODUCTOS, SE CREARA EL ARCHIVO products.json
//producto.getProducts()

//AGREGAR PRODUCTOS
//producto.addProduct('tv', '29"', 990, 'img.jpg', 'abc14FD23', 2)
//producto.addProduct('monitor', '14"', 990, 'im4g.jpg', 'abc1er423', 32)

//ACTUALIZAR PRODUCTO
//producto.updateProduct(1,'celular', 'Samsung', 9999, 'img.jpg', 'nd325o', 99999)

//BORRAR PRODUCTO
//producto.deleteById(1)






