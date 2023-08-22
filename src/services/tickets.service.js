import { ticketsModel } from "../DAO/mongodb/tickets.model.js"
import crypto from 'crypto';


class TicketsService {
    result ={
        error: false,
        msg: "",
        data: {}
    }
    async createTicket(email, productsStockTrue){
        try{
            const generateRandomCode = (length) => {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                const characterCount = characters.length;
                let code = '';
                for (let i = 0; i < length; i++) {
                    const randomIndex = crypto.randomInt(characterCount);
                    code += characters.charAt(randomIndex);
                }
                return code;
            }
            const code = generateRandomCode(12) 
            const date = new Date().toLocaleString()
            const amount = productsStockTrue.reduce((acc, curr)=>{
                const productPrice = curr.product.price
                const productQuantity = curr.quantity
                return acc + productPrice * productQuantity
            }, 0)
            const ticketToCreate = {
                code: code,
                purchase_datetime: date,
                amount :amount,
                purchaser: email
            }
            const createdTicket = await ticketsModel.create(ticketToCreate)
            this.result.data = createdTicket
            this.result.msg = 'Ticket created'
            return this.result
        }catch(error){
            this.result.error = true
            this.result.msg = 'Cannot create new ticket, something went wrong'
            return this.result
        }       
    }
}
export const ticketsService = new TicketsService()