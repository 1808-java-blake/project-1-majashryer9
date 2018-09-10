import { IUserState } from ".";
import { userTypes } from "../actions/user-actions/user.types";

const initialState: IUserState= {
    userInfo: {
        userId: 0,
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        userRole: ''
    }
}

export const userReducer= (state=initialState, action: any) => {

    switch(action.type){
        case userTypes.STORE_USER_INFO:
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    userId: action.payload.userId,
                    username: action.payload.username,
                    password: action.payload.password,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    email: action.payload.email,
                    userRole: action.payload.userRole
                }
            }
        case userTypes.CLEAR_USER_INFO:
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    userId: action.payload.userId,
                    username: action.payload.username,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    email: action.payload.email,
                    userRole: action.payload.userRole
                }
            }
    }
    return state;
}