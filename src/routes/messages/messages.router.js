import express from 'express'
import { messagesController } from '../../controllers/messages/messages.controller.js'
import {  checkIsUserNotAdmin } from '../../middlewares/auth.js'
export const routerMessagesView = express.Router()
routerMessagesView.get('/', checkIsUserNotAdmin, messagesController.messagesInit)
