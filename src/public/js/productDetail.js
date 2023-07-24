let btnAddtoCart = document.querySelectorAll('.btn-addToCart')
let btnGoToCart = document.getElementById('goToCartBtn')

let idCart = null
function addingEventListenertoAddtoCartBtn(){
    btnAddtoCart.forEach(btn=>{
       btn.addEventListener("click", async (e)=>{
        const idProduct = e.target.id
        const res = await fetch('http://localhost:8080/api/sessions/current')
       const {payload} = await res.json()
       idCart = payload.cart

       if(!idCart){
        const response = await fetch('http://localhost:8080/api/carts', {
            method: 'POST',
            headers: {'ContentType': 'application/json'}
        })
        const newCart = await response.json()
        idCart = newCart.data._id.toString()
       }
       const urlAddToCart = `http://localhost:8080/api/carts/${idCart}/products/${idProduct}`
       console.log(urlAddToCart)
        fetch(urlAddToCart, {
            method: 'POST',
            headers: {'ContentType': 'application/json'}

        })
        
        .then(res=> res.json())
        .then(data=> {let { error } = data
            if(!error){
                console.log(data)
                Swal.fire({
                    icon: 'success',
                    title: 'Product added to cart',
                  })
            }
        })
        .catch(err=> {
            if(err){
                console.error(err)
            }      
        })
       })
    })
 }
 function addingEventListenertoGotoCartBtn(){
    btnGoToCart.addEventListener("click", async ()=>{
    const res = await fetch('http://localhost:8080/api/sessions/current')
    const {payload} = await res.json()
    idCart = payload.cart
       if(idCart){
        window.location.href = `http://localhost:8080/cart/${idCart}`
       }
    })
 
 }

 addingEventListenertoAddtoCartBtn();
 addingEventListenertoGotoCartBtn();