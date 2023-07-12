import { isValidPassword } from "../utils/utils.js"
export function checkUser(req, res, next){
    if(req.session.user){
        return next()
    }
    let errorMsg = 'Debe autenticarse primero'
    return res.render('error-page', {errorMsg})
}
export function checkIsAdmin(req, res, next){
    if(req.user.email == 'adminCoder@coder.com' && isValidPassword('adminCod3r123', req.user.password)){
        req.session.user.isAdmin = true
        return next ()
    }
    return next()
}