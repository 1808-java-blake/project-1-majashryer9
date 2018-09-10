import express from 'express';
import { createUser, getUser, getNameById, updateUser, deleteUser } from '../daos/user-dao';
import { User } from '../models/user';
import { getReimbursements } from '../daos/reimbursement-dao';
import { authMiddleware } from '../security/authorization-middleware';
import { getAllUsers } from '../daos/user-dao';
import * as nodemailer from 'nodemailer';

export const userRouter=express.Router();

// create a user
userRouter.post('', [ authMiddleware('Finance Manager'), async (req, resp) => {
    try {
        const success=await createUser(new User(req.body.userId, req.body.username,
        req.body.password, req.body.firstName, req.body.lastName,
        req.body.email, req.body.userRole));
        if(success){
            let transporter= nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ERSRegisterNewUser@gmail.com',
                    pass: ''
                }
            })
            const mailOptions = {
                from: 'ERSRegisterNewUser@gmail.com',
                to: req.body.email,
                subject: 'New Expense Reimbursement System Account Created For You',
                html: `<p> Hello ${req.body.firstName} ${req.body.lastName}, </p>
                <p> A new expense reimbursement system acount has been created for you at 
                http://localhost:3000/sign-in. </p>
                <p> Please log in with the following credentials: </p>
                <p> Username: ${req.body.username} </p>
                <p> Password: ${req.body.password} </p>
                <p> Once you have logged in, please change your username/password to something 
                of your choosing. Thank you. </p>`
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if(error){
                    console.log(error);
                }
                else{
                    console.log('Successfully sent email. Info: ');
                    console.log(info);
                }
            })
            resp.sendStatus(201);
        }
        else{
            resp.sendStatus(400);
        }
    } catch (error) {
        resp.sendStatus(500);
        console.log(error);
    }
}]);

// get a user by username and password
userRouter.get('/login', async (req, resp) => {
    try {
        const user=await getUser(req.query.username, req.query.password);
        if(user){
            // set session user
            req.session.user=user[0];
            return resp.json(user[0]);
        }
        else{
            resp.sendStatus(401);
        }
    } catch (error) {
        console.log(error);
        resp.sendStatus(500);
    }
})

userRouter.get('/all', [ authMiddleware('Finance Manager'),
async (req, resp) => {
    try {
        const allUsers=await getAllUsers();
        if(allUsers){
            resp.json(allUsers);
        }
        else{
            resp.sendStatus(500);
        }
    } catch (error) {
        console.log(error);
        resp.sendStatus(500);
    }
}]);

// get a first name and last name by userId
userRouter.get('/reimbursements', [ authMiddleware('Employee', 'Finance Manager'), 
async (req, resp) => {
    try {
        const name=await getNameById(req.query.userId);
        if(name){
            resp.json(name);
        }
        else{
            resp.sendStatus(404);
        }
    } catch (error) {
        resp.sendStatus(500);
    }
} ]);   

// update user information
userRouter.put('', [ authMiddleware('Employee', 'Finance Manager'), 
async (req, resp) => {
    try {
        const updated=await updateUser(req.body.userId, req.body.username, 
        req.body.password, req.body.firstName, req.body.lastName, req.body.email, req.body.userRole);
        if(updated){
            resp.sendStatus(200);
        }
        else{
            resp.sendStatus(404);
        }
    } catch (error) {
        resp.sendStatus(500);
        console.log(error);
    }
} ]);

// delete a user by username
userRouter.delete('', [ authMiddleware('Finance Manager'), 
async (req, resp) => {
    try {
        const deleted=await deleteUser(req.body.userId);
        if(deleted){
            resp.sendStatus(200);
        }
        else{
            resp.sendStatus(404);
        }
    } catch (error) {
        resp.sendStatus(500);
        console.log(error);
    }
} ]);