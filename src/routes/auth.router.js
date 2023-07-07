import express from 'express'
import {UserModel} from '../DAO/models/user.model.js'

export const routerAuth = express.Router()
//post al register
routerAuth.post('/register', async (req, res)=>{
    try {
        const {firstName, lastName, email, password} = req.body
        if(!firstName || !lastName || !email || !password){
            return res.render('error-page')
        }
        const user = await UserModel.create({firstName, lastName, email, password})
        req.session.email = email
        req.session.firstName = firstName
        req.session.lastName = lastName
        return res.redirect('/products')
    } catch (error) {
        let errorMsg = 'Error al registrar, pruebe con otro email'
        return res.render('error-page', {errorMsg})
    }
})
//post al login
routerAuth.post('/login', async (req, res)=>{
    try {
        let errorMsg = null
        const {email, password} = req.body
        if(!email || !password){
            errorMsg = 'Error, por favor complete los campos'
            return res.render('error-page', {errorMsg})
        }
        if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
            req.session.email = email
            req.session.firstName = 'Profe'
            req.session.lastName = ''
            req.session.isAdmin = true
            return res.redirect('/products')
            }
        const foundUser = await UserModel.findOne({email})
        if(foundUser && foundUser.password === password){
            req.session.email = foundUser.email
            req.session.firstName = foundUser.firstName
            req.session.lastName = foundUser.lastName
            req.session.isAdmin = foundUser.isAdmin
            return res.redirect('/products')
        }
        errorMsg = 'Error al ingresar, por favor verifique los campos'
        return res.render('error-page', {errorMsg})
    } catch (error) {
        let errorMsg = null
        errorMsg = 'Error al ingresar, intente nuevamente'
        return res.render('error-page', {errorMsg}) 
    }  
})
