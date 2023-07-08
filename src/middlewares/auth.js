export function checkUser(req, res, next){
    if(req.session.user){
        return next()
    }
    let errorMsg = 'Debe autenticarse primero'
    return res.render('error-page', {errorMsg})
}
