
export class User{
    userId=0;
    username='';
    password='';
    firstName='';
    lastName='';
    email='';
    userRole='';

    constructor(userId?: number, username?: string, password?: string, firstName?: string,
                lastName?: string, email?: string, userRole?: string){
        userId && (this.userId=userId);
        username && (this.username=username);
        password && (this.password=password);
        firstName && (this.firstName=firstName);
        lastName && (this.lastName=lastName);
        email && (this.email=email);
        userRole && (this.userRole=userRole);
    }

}