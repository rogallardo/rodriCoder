export class CartHandlebarsDTO{
    constructor(cart){
        
        this.id = cart.id.toString()
        this.products = cart.products.map((product) => {
          return {
            id: product.product._id.toString(),
            title: product.product.title,
            description: product.product.description,
            code: product.product.code,
            price: product.product.price,
            status: product.product.status,
            stock: product.product.stock,
            category: product.product.category,
            thumbnail: product.product.thumbnail,
            quantity: product.quantity,
            totalPartial: product.quantity * product.product.price
            }
        })
        

    }

}