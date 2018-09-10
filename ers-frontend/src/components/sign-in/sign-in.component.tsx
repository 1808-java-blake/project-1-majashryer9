import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { User } from '../../model/user';
import { IUserState } from '../../reducers';
import * as userActions from '../../actions/user-actions/user.actions';
import { connect } from 'react-redux';

interface IState {
  credentials: {
    username: string,
    password: string
  },
  message: string
}

interface IProps extends RouteComponentProps<{}>, IUserState {
  storeUserInfo: (u: User) => any
}

export class SignInComponent extends React.Component<IProps, IState> {

  public constructor(props: any){
    super(props);
    this.state= {
      credentials: {
        username: '',
        password: ''
      },
      message: ''
    }
  }

  public storeUser= (u: User) => {
    this.props.storeUserInfo(u);
  }

  public updateUsername= (e: any) => {
    this.setState({
      ...this.state,
      credentials: {
        ...this.state.credentials,
        username: e.target.value
      }
    })
  }

  public updatePassword= (e: any) => {
    this.setState({
      ...this.state,
      credentials: {
        ...this.state.credentials,
        password: e.target.value
      }
    })
  }

  public updateMessage= (msg: string) => {
    this.setState({
      ...this.state,
      message: msg
    })
  }

  public submit= (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const credentials=this.state.credentials;
    fetch(`http://localhost:8888/users/login?username=${credentials.username}&password=${credentials.password}`, {
      credentials: 'include'
    })
    .then(resp => {
      if(resp.status===401){
        this.updateMessage('Invalid Credentials');
      }
      else if(resp.status===200){
        return resp.json();
      }
      else{
        this.updateMessage('Failed to log in at this time.');
      }
      throw new Error('Failed to log in.');
    })
    .then(user => {
      const newUser: User= new User(user.userId, user.username, user.password,
      user.firstName, user.lastName, user.email, user.userRole);
      this.storeUser(newUser);
      this.props.history.push('/home')
    })
    .catch(error => {
      console.log(error);
    })
  }

  public render() {
    const credentials=this.state.credentials;
    const message=this.state.message;
    return (
      <div id="signInForm">
        <form className="form-signin" onSubmit={this.submit}>
          <h1 className="h3 mb-3 font-weight-normal">Please Sign In</h1>

          <label htmlFor="inputUsername"> Enter Username </label>
          <input
            onChange={this.updateUsername}
            value={credentials.username}
            type="text"
            id="inputUsername"
            className="form-control"
            placeholder="Username"
            required />

          <label htmlFor="inputPassword"> Enter Password </label>
          <input
            onChange={this.updatePassword}
            value={credentials.password}
            type="password"
            id="inputPassword"
            className="form-control"
            placeholder="Password"
            required />

            <br />

          <button className="btn btn-lg btn-primary btn-block" type="submit"> Sign In </button>
        </form>

        {message && <p id="message">{message}</p>}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => state.user;
const mapDispatchToProps = {
  storeUserInfo: userActions.storeUserInfo
}
export default connect(mapStateToProps, mapDispatchToProps)(SignInComponent);