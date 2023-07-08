import passport from "passport";
import local from "passport-local"
import { UserModel } from "../DAO/models/user.model.js";

export function passportInit() {
    const LocalStrategy = local.Strategy
        passport.use(
            'login',
            new LocalStrategy({usernameField: 'email'}, async function (username, password, done) {
            try {
                const user = await UserModel.findOne({email: username})
                if (!user) {
                    console.log('usuario no encontrado')
                    return done(null, false)
                }
                if (password != user.password) {
                    console.log('error de autenticacion')
                    return done(null, false)
                }
                console.log('logueo exitoso')
                return done(null, user)
            } catch (err) {
                console.log(err)
                return done(err)
            }})
        );

        passport.use(
            'register',
            new LocalStrategy({passReqToCallback: true ,usernameField: 'email'} , 
            async function (req, username, password, done) {
                try {
                    let {firstName, lastName, email} = req.body
                    const user = await UserModel.findOne({email: username})
                    if (user) {
                        console.log('usuario ya existe')
                        return done(null, false)
                    }
                    const newUserCreated = {
                        firstName,
                        lastName,
                        email,
                        password,
                        isAdmin: false,
                    }
                    const newUser = await UserModel.create(newUserCreated)
                    console.log('este es el usuario creado',  newUser)
                    console.log('registro exitoso')
                    return done(null, newUser)
                } catch (err) {
                    console.log(err)
                    return done(err)
                }
        }));

        passport.serializeUser((user, done)=>{
        done(null, user._id)
        })
        
        passport.deserializeUser(async (id, done)=>{
        let user = await UserModel.findById(id)
        done(null, user)
        })
}