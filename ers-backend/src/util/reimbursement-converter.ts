import { SqlReimbursement } from '../dtos/sql-reimbursement';
import { Reimbursement } from '../models/reimbursement';

export function reimbursementConverter(r: SqlReimbursement){
    return new Reimbursement(r.reimbursement_id, r.reimbursement_amount,
    r.reimbursement_submitted, r.reimbursement_resolved, r.reimbursement_description, 
    r.reimbursement_receipt, r.reimbursement_author, r.reimbursement_resolver, 
    r.reimbursement_type, r.reimbursement_status, r.first_name, r.last_name);
}