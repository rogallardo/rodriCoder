const socket = io()
let msgs= ""
let title = document.getElementById("input-title")
let description = document.getElementById("input-description")
let code = document.getElementById("input-code")
let price = document.getElementById("input-price")
let stock = document.getElementById("input-stock")
let category = document.getElementById("input-category")
let thumbnail = document.getElementById("input-thumbnail")


let btnAdd = document.getElementById('btn-add')
let tbodyproducts = document.getElementById('tbodyproducts')

let content = ""
const deleteProduct = (id)=>{
   Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
         socket.emit('msgdelete', id)
        
      }
    })
   
}
//escucho al back
socket.on('msgtoback', (msg)=>{
   //escucho posibles mensajes
   if(msg.msgSuccess != undefined){
      Swal.fire({
         icon: 'success',
         title: `${msg.msgSuccess}`,
       })
   }
   
   if(msg.msgSuccess === 'Producto agregado'){
      title.value = ""
      description.value = ""
      code.value = ""
      price.value = ""
      stock.value = ""
      category.value = ""
      thumbnail.value = ""
   }
   
   //si hay lista de productos
   if(msg.prods){
      let reversed = msg.prods.reverse()
      content = ""
      let count = 1
      reversed.forEach(element => {
         
      //creo la lista para el front
         content += `
         
         <tr class="prueba">
         <th scope="row">${count}</th>
         <td>${element.id}</td>
         <td>${element.title}</td>
         <td>${element.description}</td>
         <td>${element.price}</td>
         <td>${element.stock}</td> 
         <td>${element.category}</td>
         <td>${element.thumbnail}</td>
         <td><button type="button" class="btn btn-danger" onclick="deleteProduct(${element.id})">Delete</button></td>  
         </tr>         
         ` 
         count++
         tbodyproducts.innerHTML = content
      });
      
   }else{
      //muestra el msj de error en caso de haberlo (proviene del backend)
      Swal.fire({
         icon: 'warning',
         title: `${msg}`,
       })
   }
})

//creo un objeto
let newProduct = {}
//al agregar mediante el boton, se le daran los valores al producto mediante los inputs
btnAdd.addEventListener("click", ()=>{
 newProduct = {
    title: title.value, 
    description: description.value, 
    code: code.value, 
    price: price.value, 
    status: true,
    stock: stock.value,
    category: category.value,
    thumbnail: thumbnail.value
 }
//validacion
const validation = ()=>{
   let val = true
   let values = Object.values(newProduct)
   let stringValueFounded = values.find(x=> x === '')
   if(stringValueFounded === ''){
      Swal.fire({
         icon: 'warning',
         title: 'Cannot add product',
         text: 'Please complete all the fields',
       })
      val = false
   }
   return val
}
//si la validacion es true
if(validation()){
   //envio el nuevo producto al back
   socket.emit('msgtoback', newProduct)
}
})




