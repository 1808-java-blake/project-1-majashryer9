import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { User } from '../../../model/user';
import  AppNav  from '../../nav/nav.component';
import { IUserState } from '../../../reducers';
import { connect } from 'react-redux';

interface IState {
    userInfo: {
        username: string,
        password: string,
        firstName: string,
        lastName: string,
        email: string,
        userRole: string
    },
    errorMessage: string
}

interface IProps extends RouteComponentProps<{}>, IUserState {

}

export class RegisterComponent extends React.Component<IProps, IState> {

    public constructor(props: any){
        super(props);
        this.state={
            userInfo: {
                username: '',
                password: '',
                firstName: '',
                lastName: '',
                email: '',
                userRole: 'Employee'
            },
            errorMessage: ''
        }
    }

    public updateUsername= (e: any) => {
        this.setState({
            ...this.state,
            userInfo: {
                ...this.state.userInfo,
                username: e.target.value
            }
        })
    }

    public updatePassword= (e: any) => {
        this.setState({
            ...this.state,
            userInfo: {
                ...this.state.userInfo,
                password: e.target.value
            }
        })
    }

    public updateFirstName= (e: any) => {
        this.setState({
            ...this.state,
            userInfo: {
                ...this.state.userInfo,
                firstName: e.target.value
            }
        })
    }

    public updateLastName= (e: any) => {
        this.setState({
            ...this.state,
            userInfo: {
                ...this.state.userInfo,
                lastName: e.target.value
            }
        })
    }

    public updateEmail= (e: any) => {
        this.setState({
            ...this.state,
            userInfo: {
                ...this.state.userInfo,
                email: e.target.value
            }
        })
    }

    public updateUserRole= (e: any) => {
        this.setState({
            ...this.state,
            userInfo: {
                ...this.state.userInfo,
                userRole: e.target.value
            }
        })
    }

    public updateErrorMessage= (error: string) => {
        this.setState({
            ...this.state,
            errorMessage: error
        })
    }

    public submit= (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const u=this.state.userInfo;
        const newUser: User=new User(0, u.username, u.password, u.firstName, u.lastName,
        u.email, u.userRole);
        fetch('http://localhost:8888/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(newUser)
        })
        .then(resp => {
            if(resp.status===201){
                this.updateErrorMessage('Successfully Created User');    
            }
            else if(resp.status===400){
                this.updateErrorMessage('Something went wrong. Please try again.')
            }
            else{
                this.updateErrorMessage('Cannot register new user at this time.')
            }
        })
        .catch(error => {
            console.log(error);
            this.updateErrorMessage('Cannot register new user at this time.')
        })
    }

  public render() {
    if(!this.props.userInfo){
        this.props.history.push('/sign-in');
    }
    const userInfo=this.state.userInfo;
    const errorMessage=this.state.errorMessage;
    return (
        <React.Fragment>
            <AppNav />
            <div className="userForms">
                <form className="form-signin" onSubmit={this.submit}>
                    <h1 className="h3 mb-3 font-weight-normal"> Please Register New User </h1>

                    <label htmlFor="inputUsername"> Enter Username </label>
                    <input
                    onChange={this.updateUsername}
                    value={userInfo.username}
                    type="text"
                    id="inputUsername"
                    className="form-control"
                    placeholder="Username"
                    required />

                    <label htmlFor="inputPassword"> Enter Password </label>
                    <input
                    onChange={this.updatePassword}
                    value={userInfo.password}
                    type="password"
                    id="inputPassword"
                    className="form-control"
                    placeholder="Password"
                    required />

                    <label htmlFor="inputFirstName"> Enter First Name </label>
                    <input
                    onChange={this.updateFirstName}
                    value={userInfo.firstName}
                    type="text"
                    id="inputFirstName"
                    className="form-control"
                    placeholder="First Name"
                    required />

                    <label htmlFor="inputLastName"> Enter Last Name </label>
                    <input
                    onChange={this.updateLastName}
                    value={userInfo.lastName}
                    type="text"
                    id="inputLastName"
                    className="form-control"
                    placeholder="Last Name"
                    required />

                    <label htmlFor="inputEmail"> Enter Email </label>
                    <input
                    onChange={this.updateEmail}
                    value={userInfo.email}
                    type="text"
                    id="inputEmail"
                    className="form-control"
                    placeholder="Email"
                    required />

                    <div className="form-group">
                    <label htmlFor="inputUserRole"> Choose User Role: </label>
                    <select onChange={this.updateUserRole} className="form-control" id="inputUserRole">
                        <option> Employee </option>
                        <option> Finance Manager </option>
                    </select>
                    </div>

                    <br />

                    <button className="btn btn-lg btn-primary btn-block" type="submit"> Register </button>

                </form>
                {errorMessage && <p id="error-message">{errorMessage}</p>}
            </div>
        </React.Fragment>
    );
  }
}

const mapStateToProps= (state: any) => (state.user);
export default connect(mapStateToProps)(RegisterComponent);
