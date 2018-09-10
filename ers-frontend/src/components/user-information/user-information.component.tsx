import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { IUserState } from '../../reducers';
import AppNav from '../nav/nav.component';
import { connect } from 'react-redux';
import * as userActions from '../../actions/user-actions/user.actions';
import { User } from '../../model/user';

interface IProps extends RouteComponentProps<{}>, IUserState {
    storeUserInfo: (u: User) => any,
}

interface IState {
    newUsername: string,
    newPassword1: string,
    newPassword2: string,
    newFirstName: string,
    newLastName: string,
    newEmail: string,
    message: string
}

export class UserInformationComponent extends React.Component<IProps, IState> {

    
    public constructor(props: any){
        super(props);
        const userInfo:any=this.props.userInfo;
        this.state= {
            newUsername: userInfo.username,
            newPassword1: userInfo.password,
            newPassword2: userInfo.password,
            newFirstName: userInfo.firstName,
            newLastName: userInfo.lastName,
            newEmail: userInfo.email,
            message: ''
        }
    }

    public updateUsername= (e: any) => {
        this.setState({
            ...this.state,
            newUsername: e.target.value
        })
    }

    public updatePassword1= (e: any) => {
        this.setState({
            ...this.state,
            newPassword1: e.target.value
        })
    }

    public updatePassword2= (e: any) => {
        this.setState({
            ...this.state,
            newPassword2: e.target.value
        })
    }

    public updateFirstName= (e: any) => {
        this.setState({
            ...this.state,
            newFirstName: e.target.value
        })
    }

    public updateLastName= (e: any) => {
        this.setState({
            ...this.state,
            newLastName: e.target.value
        })
    }

    public updateEmail= (e: any) => {
        this.setState({
            ...this.state,
            newEmail: e.target.value
        })
    }

    public updateUserInfo= (u: User) => {
        this.props.storeUserInfo(u);
    }

    public updateMessage= (msg: string) => {
        this.setState({
            ...this.state,
            message: msg
        })
    }

    public submit= (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userInfo:any=this.props.userInfo;
        if(this.state.newPassword1===this.state.newPassword2){
            fetch('http://localhost:8888/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    userId: userInfo.userId,
                    username: this.state.newUsername,
                    password: this.state.newPassword1,
                    firstName: this.state.newFirstName,
                    lastName: this.state.newLastName,
                    email: this.state.newEmail,
                    userRole: userInfo.userRole
                })
            })
            .then(resp => {
                if(resp.status===200){
                    this.updateUserInfo(new User(userInfo.userId, this.state.newUsername,
                    this.state.newPassword1, this.state.newFirstName, this.state.newLastName,
                    this.state.newEmail, userInfo.userRole));
                    this.setState({
                        newUsername: this.state.newUsername,
                        newPassword1: this.state.newPassword1,
                        newPassword2: this.state.newPassword2,
                        newFirstName: this.state.newFirstName,
                        newLastName: this.state.newLastName,
                        newEmail: this.state.newEmail
                    })
                    this.updateMessage('Successfully updated information.');
                }
                else{
                    this.updateMessage('Something went wrong. Please try again.');
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        else{
            this.updateMessage(`Passwords didn't match. Please try again.`);
        }
    }

  public render() {
      if(!this.props.userInfo){
          this.props.history.push('/sign-in');
      }
    return (
        <React.Fragment>
        <AppNav />
        <div className="userForms">
          <form className="form-signin" onSubmit={this.submit}>
            <h1 className="h3 mb-3 font-weight-normal"> Review/Update User Information </h1>

            <label htmlFor="inputUsername"> Username </label>
            <input
            onChange={this.updateUsername}
            value={this.state.newUsername}
            type="text"
            id="inputUsername"
            className="form-control"
            placeholder="Username"/>

            <label htmlFor="inputPassword"> Password </label>
            <input
            onChange={this.updatePassword1}
            value={this.state.newPassword1}
            type="password"
            id="inputPassword1"
            className="form-control"
            placeholder="Password"/>
            <input
            onChange={this.updatePassword2}
            value={this.state.newPassword2}
            type="password"
            id="inputPassword2"
            className="form-control"
            placeholder="Re-Enter Password"/>

            <label htmlFor="inputFirstName"> First Name </label>
            <input
            onChange={this.updateFirstName}
            value={this.state.newFirstName}
            type="text"
            id="inputFirstName"
            className="form-control"
            placeholder="First Name"/>

            <label htmlFor="inputLastName"> Last Name </label>
            <input
            onChange={this.updateLastName}
            value={this.state.newLastName}
            type="text"
            id="inputLastName"
            className="form-control"
            placeholder="Last Name"/>

            <label htmlFor="inputLastName"> Email </label>
            <input
            onChange={this.updateEmail}
            value={this.state.newEmail}
            type="text"
            id="inputEmail"
            className="form-control"
            placeholder="Email"/>
            
            <button className="btn btn-lg btn-primary btn-block" type="submit"> Update </button>
          </form>
          {this.state.message && <p id="message">{this.state.message}</p>}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps= (state:any) => state.user;
const mapDispatchToProps= {
    storeUserInfo: userActions.storeUserInfo
}
export default connect(mapStateToProps, mapDispatchToProps)(UserInformationComponent);