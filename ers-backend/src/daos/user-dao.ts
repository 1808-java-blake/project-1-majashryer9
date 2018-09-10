import { User } from '../models/user';
import { connectionPool } from '../util/connection-util';
import { userConverter } from '../util/user-converter';

// create a user
export async function createUser(u: User){
    const client=await connectionPool.connect();
    const user_role_id=(u.userRole==='Employee')? 1: 2;
    try {
        const resp= await client.query(`
            INSERT INTO ers.users(username, password, first_name, last_name, email,
            user_role_id) VALUES($1, $2, $3, $4, $5, $6)
            RETURNING user_id`, [u.username, u.password, u.firstName,
            u.lastName, u.email, user_role_id]);
        return resp.rows[0];
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
}

// get a user by username/password
export async function getUser(username: string, password: string){
    const client=await connectionPool.connect();
    try {
        const resp=await client.query(`
            SELECT user_id, username, password, first_name, last_name, email, user_role FROM ers.users
            INNER JOIN ers.user_roles USING(user_role_id)
            WHERE username=$1 AND password=$2`, [username, password]);
        return resp.rows.map(userConverter);
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
}

export async function getAllUsers(){
    const client=await connectionPool.connect();
    try {
        const resp= await client.query(`
        SELECT user_id, username, password, first_name, last_name,
        email, user_role FROM ers.users
        INNER JOIN ers.user_roles USING(user_role_id)`);
        return resp.rows.map(userConverter);
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
}

// get a first name and last name by userId
export async function getNameById(userId: number){
    const client=await connectionPool.connect();
    try {
        const resp=await client.query(`
            SELECT first_name, last_name FROM ers.users 
            WHERE user_id=$1`, [userId]);
        return resp.rows[0];
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
}

// update user information
export async function updateUser(userId: number, username: string, password: string, firstName: string,
lastName: string, email: string, userRole: string){
    const client= await connectionPool.connect();
    const user_role_id=(userRole==='Employee')? 1: 2;
    try {
        const resp= await client.query(`
            UPDATE ers.users
            SET username=$1,
            password=$2,
            first_name=$3,
            last_name=$4,
            email=$5,
            user_role_id=$6
            WHERE user_id=$7`, [username, password, firstName, lastName,
            email, user_role_id, userId]);
        return resp;
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
}

// delete a user by username
export async function deleteUser(userId: number){
    const client=await connectionPool.connect();
    try {
        const resp1= await client.query(`DELETE FROM ers.reimbursements
            WHERE reimbursement_author=$1`, [userId]);
        let resp;
        if(resp1){
            resp=await client.query(`DELETE FROM ers.users
            WHERE user_id=$1`, [userId])
        }
        return resp;
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
}