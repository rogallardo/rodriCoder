let btnAddtoCart = document.querySelectorAll('.btn-primary')

function addingEventListenertoAddtoCartBtn(){    
    btnAddtoCart.forEach(btn=>{
       btn.addEventListener("click", (e)=>{
        const idProduct = e.target.id
        //cart=648752d1f9a4e463ea96a97a
        fetch(`http://localhost:8080/api/carts/648752d1f9a4e463ea96a97a/products/${idProduct}`, {
            method: 'POST',
            headers: {'ContentType': 'application/json'}

        })
        .then(res=> res.json())
        .then(data=> console.log(data))
        .catch(err=> {
            if(err){
                console.error(err)
            }      
        })
       })
    })
 }
 addingEventListenertoAddtoCartBtn()