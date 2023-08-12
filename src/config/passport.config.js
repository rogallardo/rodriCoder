import passport from "passport";
import local from "passport-local"
import fetch from 'node-fetch';
import GitHubStrategy from 'passport-github2';
import GoogleStrategy from 'passport-google-oauth20'
import {UserModel} from "../DAO/mongodb/models/user.model.js";
import { createHash } from "../utils/utils.js";
import { isValidPassword } from "../utils/utils.js";

export function passportInit() {
    const LocalStrategy = local.Strategy

    passport.use(
        'google',
        new GoogleStrategy({
            clientID: '781863108818-bmc17tfcfek0m99aah8qpnnsqs0g7u4v.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: "http://localhost:8080/api/sessions/googlecallback"
        },
        async function (accessToken, refreshToken, profile, done) {
            try{
                let user = await UserModel.findOne({
                    email: profile._json.email
                });
                if (!user) {
                    const newUser = {
                        email: profile._json.email,
                        firstName: profile._json.given_name || profile._json.name || 'noname',
                        lastName: profile._json.family_name || 'nolast',
                        isAdmin: false,
                        password: 'nopass',

                    };
                    let userCreated = await UserModel.create(newUser);
                    console.log('User Registration succesful');
                    return done(null, userCreated);
                } else {
                    console.log('User already exists');
                    return done(null, user);
                }
            } catch (e) {
                console.log('Error en auth Google');
                console.log(e);
                return done(e);
            }
            
        }
    ));
    passport.use(
        'github',
        new GitHubStrategy({
                clientID: 'Iv1.5aea7c18da19cb17',
                clientSecret: '3664b07f5c118cd8bee6d7db8c5e556563714b43',
                callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
            },
            async (accesToken, _, profile, done) => {
                console.log(profile);
                try {
                    const res = await fetch('https://api.github.com/user/emails', {
                        headers: {
                            Accept: 'application/vnd.github+json',
                            Authorization: 'Bearer ' + accesToken,
                            'X-Github-Api-Version': '2022-11-28',
                        },
                    });
                    const emails = await res.json();
                    const emailDetail = emails.find((email) => email.verified == true);

                    if (!emailDetail) {
                        return done(new Error('cannot get a valid email for this user'));
                    }
                    profile.email = emailDetail.email;

                    let user = await UserModel.findOne({
                        email: profile.email
                    });
                    if (!user) {
                        const newUser = {
                            email: profile.email,
                            firstName: profile._json.name || profile._json.login || 'noname',
                            lastName: 'nolast',
                            isAdmin: false,
                            password: 'nopass',
                        };
                        let userCreated = await UserModel.create(newUser);
                        console.log('User Registration succesful');
                        return done(null, userCreated);
                    } else {
                        console.log('User already exists');
                        return done(null, user);
                    }
                } catch (e) {
                    console.log('Error en auth github');
                    console.log(e);
                    return done(e);
                }
            }
        )
    );
    passport.use(
        'login',
        new LocalStrategy({
            usernameField: 'email'
        }, async function (username, password, done) {
            try {
                const user = await UserModel.findOne({
                    email: username
                })
                if (!user) {
                    console.log('usuario no encontrado')
                    return done(null, false)
                }
                if (!isValidPassword(password, user.password)) {
                    console.log('error de autenticacion')
                    return done(null, false)
                }
                console.log('logueo exitoso')
                return done(null, user)
            } catch (err) {
                console.log(err)
                return done(err)
            }
        })
    );
    passport.use(
        'register',
        new LocalStrategy({
                passReqToCallback: true,
                usernameField: 'email'
            },
            async function (req, username, password, done) {
                try {
                    let {
                        firstName,
                        lastName,
                        email
                    } = req.body
                    const user = await UserModel.findOne({
                        email: username
                    })
                    if (user) {
                        console.log('usuario ya existe')
                        return done(null, false)
                    }
                    const newUserCreated = {
                        firstName,
                        lastName,
                        email,
                        password: createHash(password),
                        isAdmin: false,
                    }
                    const newUser = await UserModel.create(newUserCreated)
                    console.log('este es el usuario creado', newUser)
                    console.log('registro exitoso')
                    return done(null, newUser)
                } catch (err) {
                    console.log(err)
                    return done(err)
                }
    }));
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id)
        done(null, user)
    })
}