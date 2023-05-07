import fs from'fs'
import path from'path'



export default class ProductManager {
    constructor(){
        
        this.products = []
        
        this.path =  '/src/products.json'

    }
    async getProducts(){
         try {
            const file =  await fs.promises.readFile(path.resolve()  + this.path,'utf-8')
            const fileParsed = JSON.parse(file)     
            this.products = fileParsed
            return this.products
         } catch (error) {  
            const productsJSON = JSON.stringify(this.products)
            fs.writeFileSync('products.json', productsJSON)
            console.log(this.path)
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
        price, //200,
        thumbnail, //”Sin imagen”
        code, //abc123”,
        stock //25
    ){
        
       const file =  await fs.promises.readFile(path.resolve()  + this.path,'utf-8')
        const fileParsed = JSON.parse(file)
        this.products = fileParsed
        
        //VALIDACION
        let validation = true
        const fieldValidation = (field)=>{
            console.log(`Error, ${field} incomplete`)
            validation = false
        }
        const codeValidation =(code)=>{
            let newCode = this.products.find(product => product.code === code)
            if(newCode){
                validation = false
                return console.log('The ingresed code already exists')                
            }else{
                return code
            }
        } 
        const id = await this.idGenerator()
        title = title ??  fieldValidation('title')
        description = description ??  fieldValidation('description')
        price = price ??  fieldValidation('price')
        thumbnail = thumbnail ??  fieldValidation('thumbnail')
        code =  codeValidation(code)
        
        //LUEGO DE VALIDAR, CREAMOS EL OBJETO DEL PRODUCTO Y LO AGREGAMOS AL ARRAY
        const newProduct = {id, title, description, price, thumbnail, code, stock}
        if (validation){
            this.products.push(newProduct)
            const productsToJSON = JSON.stringify(this.products)
            await fs.promises.writeFile('products.json', productsToJSON)
            console.log('product added')
        }       
    }
    async deleteById(id){
        const file =  await fs.promises.readFile(path.resolve()  + this.path,'utf-8')
        const fileParsed = JSON.parse(file)
        this.products = fileParsed
        let foundId = this.products.some(x=> x.id === id)
        if(foundId){
            let newArray = this.products.filter(x=> x.id!= id)
            this.products = newArray
            const productsToJSON = JSON.stringify(this.products)
            await fs.promises.writeFile('products.json', productsToJSON)
            console.log(`check the file products.json`)
        }else{
            console.log('cannot delete inexistent id')
        }
      
       
    }
   async updateProduct(
        id,
        title, // “producto prueba” 
        description, //”Este es un producto prueba”
        price, //200,
        thumbnail, //”Sin imagen”
        code, //abc123”,
        stock //25
   ){
    //SE LEERA EL ARCHIVO JSON Y SE PARSEARA PARA PODER TRABAJAR CON EL ARRAY
        const file = await fs.promises.readFile(path.resolve() + this.path, 'utf-8')
        const fileParsed = JSON.parse(file)
        this.products = fileParsed
        //BUSCAMOS EL ID DEL PRODUCTO A ACTUALIZAR
        let productFound =  await this.getProductById(id)
        //SI LO ENCUENTRO PROCEDO CON LA VALIDACION DE LOS INPUTS
        if(productFound){
            productFound = {...productFound, title, description, price, thumbnail, code, stock}
            //VALIDACION
            let validation = true
            const fieldValidation = (field)=>{
                console.log(`Error, ${field} incomplete`)
                validation = false
            }
            const codeValidation =(code)=>{
                let newCode = this.products.find(product => product.code === code)
                if(newCode){
                    validation = false
                    return console.log('The ingresed code already exists')                
                }else{
                    return code
                }
            }       
            title = title ??  fieldValidation('title')
            description = description ??  fieldValidation('description')
            price = price ??  fieldValidation('price')
            thumbnail = thumbnail ??  fieldValidation('thumbnail')
            code =  codeValidation(code)
         
         //LUEGO DE VALIDAR, CREAMOS EL OBJETO DEL PRODUCTO Y LO AGREGAMOS AL ARRAY
        
            if (validation){
               await this.deleteById(id)
                this.products = [...this.products, productFound]
                const productsToJSON = JSON.stringify(this.products)
                await fs.promises.writeFile('products.json', productsToJSON)
                console.log('product updated succesfully')
        } else {
            console.log('cannot update product, please check validation data')
        }            
        }         
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






