export function checkUser(req, res, next){
    if(req.session.email){
        return next()
    }
    let errorMsg = 'Debe autenticarse primero'
    return res.render('error-page', {errorMsg})
}
