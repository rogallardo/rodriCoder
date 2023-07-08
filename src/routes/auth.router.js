import express from 'express'
import passport from 'passport'

export const routerAuth = express.Router()
//post al register
routerAuth.post('/register', passport.authenticate('register', {failureRedirect: '/api/session/error-register' }), async (req, res)=>{
    try {
        if(!req.user){
          return res.redirect('/api/session/error-register') 
        }
        req.session.user = { email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName}
        return res.redirect('/products')
    } catch (error) {
        let errorMsg = 'Error al registrar, pruebe con otro email'
        return res.render('error-page', {errorMsg})
    }
})
//post al login
routerAuth.post('/login', passport.authenticate('login', {failureRedirect: '/api/session/error-login'}) , async (req, res)=>{
    req.session.user = { email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, isAdmin: req.user.isAdmin}
    if(req.user.email == 'adminCoder@coder.com' && req.user.password === 'adminCod3r123'){
        req.session.user.isAdmin = true
    }  
    return res.redirect('/products')
})
routerAuth.get('/error-login', (req, res)=>{
    res.send('error de login con passport')
})
//error register page
routerAuth.get('/error-register', (req, res)=>{
    res.send('error de register con passport')
})
//get logout
routerAuth.get('/logout', (req, res)=>{
    req.session.destroy((error)=>{
        if(error){
            let errorMsg = 'Error al cerrar sesion'
            return res.render('error-page', errorMsg)
        }
    })
    return res.redirect('/login')
})
