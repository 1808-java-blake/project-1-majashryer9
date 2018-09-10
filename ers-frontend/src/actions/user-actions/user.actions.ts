import { User } from '../../model/user';
import { userTypes } from './user.types';

export const storeUserInfo= (u: User) => {
    return {
        payload: {
            userId: u.userId,
            username: u.username,
            password: u.password,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            userRole: u.userRole
        },
        type: userTypes.STORE_USER_INFO
    }
}

export const clearUserInfo= () => {
    return {
        payload: {
            userId: '',
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            email: '',
            userRole: ''
        },
        type: userTypes.CLEAR_USER_INFO
    }
}