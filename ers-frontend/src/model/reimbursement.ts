
export class Reimbursement{
    reimbursementId=0;
    reimbursementAmount=0;
    reimbursementSubmitted='';
    reimbursementResolved='';
    reimbursementDescription='';
    reimbursementReceipt='';
    reimbursementAuthor=0;
    reimbursementResolver=0;
    reimbursementType='';
    reimbursementStatus='';
    firstName='';
    lastName='';

    constructor(reimbursementId?: number, reimbursementAmount?: number, 
                reimbursementSubmitted?: string, reimbursementResolved?: string, 
                reimbursementDescription?: string, reimbursementReceipt?: any,
                reimbursementAuthor?: number, reimbursementResolver?: number,
                reimbursementType?: string, reimbursementStatus?: string,
                firstName?: string, lastName?: string){
        reimbursementId && (this.reimbursementId=reimbursementId);
        reimbursementAmount && (this.reimbursementAmount=reimbursementAmount);
        reimbursementSubmitted && (this.reimbursementSubmitted=reimbursementSubmitted);
        reimbursementResolved && (this.reimbursementResolved=reimbursementResolved);
        reimbursementDescription && (this.reimbursementDescription=reimbursementDescription);
        reimbursementReceipt && (this.reimbursementReceipt=reimbursementReceipt);
        reimbursementAuthor && (this.reimbursementAuthor=reimbursementAuthor);
        reimbursementResolver && (this.reimbursementResolver=reimbursementResolver);
        reimbursementType && (this.reimbursementType=reimbursementType);
        reimbursementStatus && (this.reimbursementStatus=reimbursementStatus);
        firstName && (this.firstName=firstName);
        lastName && (this.lastName=lastName);
    }
}