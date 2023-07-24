import express from 'express'
import passport from 'passport'

export const routerAuth = express.Router()
//get google session
routerAuth.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))
routerAuth.get('/googlecallback', passport.authenticate('google', {failureRedirect: '/api/sessions/error-google'}), async (req, res)=>{
    req.session.user = req.user;
    res.redirect('/products')
})
routerAuth.get('/error-google', (req, res)=>{
    res.send('error al ingresar con Google')
});
//get github session
routerAuth.get('/github', passport.authenticate('github', {scope: ['user: email']}));
routerAuth.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/api/sessions/error-github' }), async (req, res)=>{
    req.session.user = req.user;
    res.redirect('/products')
});
//error github access
routerAuth.get('/error-github', (req, res)=>{
    res.send('error al ingresar con github')
});
//post al register
routerAuth.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/error-register' }), async (req, res)=>{
    try {
        if(!req.user){
          return res.redirect('/api/sessions/error-register') 
        }
        req.session.user = { email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName}
        return res.redirect('/products')
    } catch (error) {
        let errorMsg = 'Error al registrar, pruebe con otro email'
        return res.render('error-page', {errorMsg})
    }
});
//error register page
routerAuth.get('/error-register', (req, res)=>{
    res.send('error de register con passport')
});
//post al login
routerAuth.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/error-login'}) , async (req, res)=>{
    req.session.user = { email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, isAdmin: req.user.isAdmin}
    return res.redirect('/products')
});
// error login page
routerAuth.get('/error-login', (req, res)=>{
    res.send('error de login con passport')
});
routerAuth.get('/current', (req, res)=>{
    let {user} = req
   return res.json({
        payload: user
    })
})
//logout
routerAuth.get('/logout', (req, res)=>{
    if(req.session){
        req.session.destroy((error)=>{
        if(error){
            let errorMsg = 'Error al cerrar sesion'
            return res.render('error-page', errorMsg)
        }
    })
    return res.redirect('/login')
    }
    
});
