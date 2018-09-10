import { combineReducers } from "redux";
import { userReducer } from './user.reducer';


export interface IUserState {
    userInfo?: {
        userId: number,
        username: string,
        password: string,
        firstName: string,
        lastName: string,
        email: string,
        userRole: string
    }
}

export interface IState {
    user: IUserState
}

export const state = combineReducers<IState>({
    user: userReducer
})