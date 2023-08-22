import express from "express";
export const routerAuthView = express.Router()

//render register
routerAuthView.get('/register', (req, res)=>{
    res.render('register')
})
//render login
routerAuthView.get('/login', (req, res)=>{
    res.render('login')
})