import { connectionPool } from "../util/connection-util";
import { reimbursementConverter } from "../util/reimbursement-converter";
import { Reimbursement } from "../models/reimbursement";
import * as AWS from 'aws-sdk';

const accessKey='';
const secretKey='';
const bucketName='mshryer-s3-bucket'
// create reimbursement
export async function createReimbursement(r: Reimbursement){
    const client=await connectionPool.connect();
    try {
        let s3Bucket=new AWS.S3({
            signatureVersion: 'v4',
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            region: 'us-east-2'
        })
        let chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key='';
        for(let i=0; i < 20; i++){
            key+=chars[Math.floor(Math.random()*chars.length)]
        }
        let params= {
            Bucket: 'mshryer-s3-bucket',
            Key: key,
            Expires: 60*60
        }
        let signedUrl=await s3Bucket.getSignedUrl('putObject', params);
        const reimbursementTypeId=(r.reimbursementType==='Lodging')? 1 : 
        (r.reimbursementType==='Travel')? 2 : (r.reimbursementType==='Food')? 3 : 4;
        client.query(`INSERT INTO ers.reimbursements(reimbursement_amount, 
            reimbursement_submitted, reimbursement_description, 
            reimbursement_receipt, reimbursement_author, reimbursement_status_id,
            reimbursement_type_id) VALUES($1, $2, $3, $4, $5, $6, $7)`, [r.reimbursementAmount, 
            r.reimbursementSubmitted, r.reimbursementDescription, key, 
            r.reimbursementAuthor, 1, reimbursementTypeId]);
            return signedUrl;
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
}

// get all pending reimbursements
export async function getAllPendingReimbursements(){
    const client= await connectionPool.connect();
    try {
        // all DB
        const resp=await client.query(`
            SELECT reimbursement_id, reimbursement_amount, reimbursement_submitted,
            reimbursement_resolved, reimbursement_description, reimbursement_receipt, 
            reimbursement_author, reimbursement_resolver, reimbursement_type,
            reimbursement_status, first_name, last_name FROM ers.reimbursements
            INNER JOIN ers.reimbursement_type USING(reimbursement_type_id)
            INNER JOIN ers.reimbursement_status USING(reimbursement_status_id)
            INNER JOIN ers.users ON(reimbursement_author=user_id)
            WHERE reimbursement_status LIKE 'Pending'
            ORDER BY(reimbursement_submitted) DESC`);
        let s3Bucket=new AWS.S3({
            signatureVersion: 'v4',
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            region: 'us-east-2'
        })
        let convertedReimbursements=resp.rows.map(reimbursementConverter);
        return convertedReimbursements.map(r => {
            const key=r.reimbursementReceipt;
            let params= {
                Bucket: 'mshryer-s3-bucket',
                Key: key,
                Expires: 60*60
            }
            let signedUrl= s3Bucket.getSignedUrl('getObject', params);
            r.reimbursementReceipt=`${signedUrl}`;
            return r;
        });
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
}

export async function getAllReimbursements(){
    const client= await connectionPool.connect();
    try {
        // all DB
        const resp=await client.query(`
            SELECT reimbursement_id, reimbursement_amount, reimbursement_submitted,
            reimbursement_resolved, reimbursement_description, reimbursement_receipt, 
            reimbursement_author, reimbursement_resolver, reimbursement_type,
            reimbursement_status, first_name, last_name FROM ers.reimbursements
            INNER JOIN ers.reimbursement_type USING(reimbursement_type_id)
            INNER JOIN ers.reimbursement_status USING(reimbursement_status_id)
            INNER JOIN ers.users ON(reimbursement_author=user_id)
            ORDER BY(reimbursement_submitted) DESC`);
        let s3Bucket=new AWS.S3({
            signatureVersion: 'v4',
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            region: 'us-east-2'
        })
        let convertedReimbursements=resp.rows.map(reimbursementConverter);
        return convertedReimbursements.map(r => {
            const key=r.reimbursementReceipt;
            let params= {
                Bucket: 'mshryer-s3-bucket',
                Key: key,
                Expires: 60*60
            }
            let signedUrl= s3Bucket.getSignedUrl('getObject', params);
            r.reimbursementReceipt=`${signedUrl}`;
            return r;
        });
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
}

// get reimbursements by user id
export async function getReimbursements(userId: number){
    const client= await connectionPool.connect();
    try {
        const resp=await client.query(`
            SELECT reimbursement_id, reimbursement_amount, reimbursement_submitted,
            reimbursement_resolved, reimbursement_description, reimbursement_receipt, 
            reimbursement_author, reimbursement_resolver, reimbursement_type,
            reimbursement_status, first_name, last_name FROM ers.reimbursements
            INNER JOIN ers.reimbursement_type USING(reimbursement_type_id)
            INNER JOIN ers.reimbursement_status USING(reimbursement_status_id)
            LEFT JOIN ers.users ON(reimbursement_resolver=user_id)
            WHERE reimbursement_author=$1
            ORDER BY(reimbursement_submitted) DESC`, [userId]);
        let s3Bucket=new AWS.S3({
            signatureVersion: 'v4',
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            region: 'us-east-2'
        })
        let convertedReimbursements=resp.rows.map(reimbursementConverter);
        return convertedReimbursements.map(r => {
            const key=r.reimbursementReceipt;
            let params= {
                Bucket: 'mshryer-s3-bucket',
                Key: key,
                Expires: 60*60
            }
            let signedUrl= s3Bucket.getSignedUrl('getObject', params);
            r.reimbursementReceipt=`${signedUrl}`;
            return r;
        });
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
}

// update reimbursement
export async function updateReimbursement(reimbursementId: number, reimbursementResolved: Date,
reimbursementResolver: number, reimbursementStatus: string){
    const client=await connectionPool.connect();
    const reimbursement_status_id=(reimbursementStatus==='Pending')? 1 :
    (reimbursementStatus==='Approved')? 2: 3;
    try {
        const resp=client.query(`UPDATE ers.reimbursements
            SET reimbursement_resolved=$1,
            reimbursement_resolver=$2,
            reimbursement_status_id=$3
            WHERE reimbursement_id=$4`, [reimbursementResolved, reimbursementResolver, 
            reimbursement_status_id, reimbursementId]);
        return resp;
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
}

// delete pending reimbursement
export async function deletePendingReimbursement(reimbursementId : number){
    const client=await connectionPool.connect();
    try {
        const resp=client.query(`
            DELETE FROM ers.reimbursements
            WHERE reimbursement_id=$1 AND reimbursement_status_id=$2`, [reimbursementId, 1]);
        return resp;
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
}