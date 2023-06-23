let btnAddtoCart = document.querySelectorAll('.btn-addToCart')

function addingEventListenertoAddtoCartBtn(){
    btnAddtoCart.forEach(btn=>{
       btn.addEventListener("click", (e)=>{
        const idProduct = e.target.id
        const idCart = '648752d1f9a4e463ea96a97a'

        fetch(`http://localhost:8080/api/carts/${idCart}/products/${idProduct}`, {
            method: 'POST',
            headers: {'ContentType': 'application/json'}

        })
        .then(res=> res.json())
        .then(data=> {let { error } = data
            if(!error){
                Swal.fire({
                    icon: 'success',
                    title: 'Product added to cart: 648752d1f9a4e463ea96a97a',
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
 addingEventListenertoAddtoCartBtn()