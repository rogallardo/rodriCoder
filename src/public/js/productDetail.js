//DOM elements
let btnAddtoCart = document.querySelector('.btn-addToCart')
let btnGoToCart = document.getElementById('goToCartBtn')


//global variables, will be helpfull with fetching params in the urls
let idCart = null
let idProduct = null
// helpers fetchdata function
async function fetchData(url, method) {
    let options = {
        method: method,
        headers: {
            'ContentType': 'application/json'
        }
    }
    if (method == 'GET') {
        options = undefined
    }
    const response = await fetch(url, options)
    const data = await response.json()
    return data
}
//adding eventslisteners to btns, also fetching post to create cart in case that user has no one 
async function addingEventListenertoAddtoCartBtn() {
    btnAddtoCart.addEventListener("click", async (e) => {
        try {
            idProduct = e.target.id
            const { payload, status } = await fetchData('http://localhost:8080/api/sessions/current', 'GET')
            idCart = payload.cart.toString()
            if (idCart) { 
                const { error, status } = await fetchData(`http://localhost:8080/api/carts/${idCart}/products/${idProduct}`, 'POST')
                if (!error) {
                    Swal.fire({
                        icon: 'success',
                        title: status
                    })
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
function addingEventListenertoGotoCartBtn() {
    btnGoToCart.addEventListener("click", async () => {
        try {
            const { payload } = await fetchData('http://localhost:8080/api/sessions/current', 'GET')
            idCart = payload.cart
            if (idCart) {
                window.location.href = `http://localhost:8080/cart/${idCart}`
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
//functions init
addingEventListenertoAddtoCartBtn();
addingEventListenertoGotoCartBtn();

