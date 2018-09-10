import express from 'express';
import { createReimbursement, getReimbursements, updateReimbursement, deletePendingReimbursement, getAllReimbursements, getAllPendingReimbursements } from '../daos/reimbursement-dao';
import { Reimbursement } from '../models/reimbursement';
import { authMiddleware } from '../security/authorization-middleware';

export const reimbursementRouter=express.Router();

// create a reimbursement
reimbursementRouter.post('', [ authMiddleware('Employee', 'Finance Manager'), 
async (req, resp) => {
    try {
        const reimbursementId= await createReimbursement(new Reimbursement(req.body.reimbursementId,
        req.body.reimbursementAmount, req.body.reimbursementSubmitted, req.body.reimbursementResolved,
        req.body.reimbursementDescription, req.body.reimbursementReceipt, req.body.reimbursementAuthor,
        req.body.reimbursementResolver, req.body.reimbursementType, req.body.reimbursementStatus));
        if(reimbursementId){
            resp.json(reimbursementId);
        }
        else{
            resp.sendStatus(500);
        }
    } catch (error) {
        resp.sendStatus(500);
        console.log(error);
    }
} ]);

// get reimbursements
reimbursementRouter.get('', [ authMiddleware('Employee', 'Finance Manager'), 
async (req, resp) => {
    try {
        const reimbursements=await getReimbursements(req.query.userId);
        if(reimbursements){
            resp.json(reimbursements);
        }
        else{
            resp.sendStatus(404);
        }
    } catch (error) {
        resp.sendStatus(500);
        console.log(error);
    }
} ]);

// get all pending reimbursements (finance manager only)
reimbursementRouter.get('/allPending', [ authMiddleware('Finance Manager'), 
async (req, resp) => {
    try {
        const reimbursements=await getAllPendingReimbursements();
        if(reimbursements){
            resp.json(reimbursements);
        }
        else{
            resp.sendStatus(404);
        }
    } catch (error) {
        resp.sendStatus(500);
        console.log(error);
    }
} ]);

// get all pending reimbursements (finance manager only)
reimbursementRouter.get('/all', [ authMiddleware('Finance Manager'), 
async (req, resp) => {
    try {
        const reimbursements=await getAllReimbursements();
        if(reimbursements){
            resp.json(reimbursements);
        }
        else{
            resp.sendStatus(404);
        }
    } catch (error) {
        resp.sendStatus(500);
        console.log(error);
    }
} ]);

// update a reimbursement
reimbursementRouter.put('', [ authMiddleware('Finance Manager'),
async (req, resp) => {
    try {
        const success=await updateReimbursement(req.body.reimbursementId, req.body.reimbursementResolved, 
            req.body.reimbursementResolver, req.body.reimbursementStatus);
            if(success){
                resp.sendStatus(200);
            }
            else{
                resp.sendStatus(500);
            }
    } catch (error) {
        resp.sendStatus(500);
        console.log(error);
    }
} ]);

// delete a pending reimbursmeent
reimbursementRouter.delete('', [ authMiddleware('Employee', 'Finance Manager'), 
async (req, resp) => {
    try {
        const success= await deletePendingReimbursement(req.body.reimbursementId);
        if(success){
            resp.sendStatus(200);
        }
        else{
            resp.sendStatus(404);
        }   
    } catch (error) {
        resp.sendStatus(500);
    }
} ]);
