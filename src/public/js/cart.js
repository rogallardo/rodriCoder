//DOM elements
let idCart = null
let btnPurchase = document.querySelector('.btn-purchase')
let btnPlus = document.querySelectorAll('.btn-plus')
let btnMinus = document.querySelectorAll('.btn-minus')

// let partialPrice = document.querySelector('.partial-price')
// let quantityInput = document.querySelectorAll('.quantity-input')
// helpers fetchdata function
async function fetchData(url, method, body = undefined) {
    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    }
    if (method == 'GET') {
        options = undefined
    }
    const response = await fetch(url, options)
    const data = await response.json()
    return data
}
//Getting id cart
const userIdCart = async () =>{
    try {
        const { payload } = await fetchData('http://localhost:8080/api/sessions/current', 'GET')
        idCart = payload.cart.toString()
    } catch (error) {
        console.log('Cannot get idCart: ' + error)   
    }  
}
//adding eventslisteners to btns, also fetching post to create cart in case that user has no one 
async function addingEventListenertoPurchaseBtn() {
    btnPurchase.addEventListener("click", async (e) => {  
        try {
            const { payload } = await fetchData(`http://localhost:8080/api/carts/${idCart}`, 'GET')
            const stockCheck = payload.products.filter(product => product.product.stock < product.quantity )
            if(!stockCheck.length && !payload.products.length){
                return Swal.fire({
                    icon: 'warning',
                    title: 'Your cart is empty',
                })
            }
            if(!stockCheck.length && payload.products.length){
                const res = await fetchData(`http://localhost:8080/api/carts/${idCart}/purchase`, 'POST')
                console.log(res)
                return Swal.fire({
                    icon: 'success',
                    title: 'Purchase success, please check ticket',
                })
                
            }
            if(stockCheck.length === payload.products.length){
               return Swal.fire({
                    icon: 'warning',
                    title: 'Products are out of stock, please check to continue',
                })
            }
            if(stockCheck.length != payload.products.length){
                const confirmationResult = await Swal.fire({
                    icon: 'warning',
                    title: 'Confirm Purchase',
                    text: 'Some products are out of stock, continue anyway?',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                });
            
                if (confirmationResult.isConfirmed) {
                    const res = await fetchData(`http://localhost:8080/api/carts/${idCart}/purchase`, 'POST');
                    console.log(res)
                    Swal.fire({
                        icon: 'success',
                        title: 'Purchase success, please check ticket',
                    });
                }
            }
           
            
        } catch (error) {
            if(error){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops!, something went wrong',
                })
            }
        }            
    })  
}
async function addingEventListenertoPlusBtn() {
    btnPlus.forEach((btn =>{
        btn.addEventListener("click", async (e) => {  
            handleQuantity(e, 'plus')
        })   
    }))        
}
async function addingEventListenertoMinusBtn() {
    btnMinus.forEach((btn =>{
        btn.addEventListener("click", async (e) => {  
            handleQuantity(e, 'minus')
        })   
    }))          
}
async function handleQuantity(e, operation){
    try {    
        const idProduct = e.target.id
        let priceText = document.querySelector(`.price[data-id="${idProduct}"]`).textContent
        let totalPartialText = document.querySelector(`.total-partial[data-id="${idProduct}"]`);
        const quantityInput = document.querySelector(`.quantity-input[data-id="${idProduct}"]`);
        let newValue = 1
        if(operation === 'plus'){
            newValue = Number(quantityInput.value) + 1
        }else{
            if(quantityInput.value > 1){
                newValue = Number(quantityInput.value) - 1
            } 
        } 
        const res = await fetch(`http://localhost:8080/api/carts/${idCart}/products/${idProduct}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ quantity: newValue })
        })
        const data = await res.json()
        quantityInput.value = data.payload.quantity      
        totalPartialText.innerText = priceText * data.payload.quantity
    } catch (error) {
        if(error){
            Swal.fire({
                icon: 'error',
                title: 'Oops!, something went wrong',
            })
        }
    }
}

//functions init
(async ()=>{
    await userIdCart();
    addingEventListenertoPlusBtn();
    addingEventListenertoMinusBtn();
    addingEventListenertoPurchaseBtn();   
})()

