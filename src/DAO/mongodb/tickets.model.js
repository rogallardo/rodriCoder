import { TicketModel } from "./models/ticket.model.js";

class TicketsModel{
   async create(ticketToCreate){
        try {
			const ticketCreated = await TicketModel.create(ticketToCreate);
			return ticketCreated;
		} catch (error) {
			console.log(error);
		}
    }
    async getById(tid) {
		try {
			const ticket = await TicketModel.findById(tid)
			return ticket;
		} catch (error) {
			throw Error ('Error reading db mongo: ' + error);
		}
	}
}

export const ticketsModel = new TicketsModel()