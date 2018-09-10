import * as React from 'react';
import { Link } from 'react-router-dom';
import ExpendItLogo from '../../assets/ExpendIt.png';
import { IUserState } from '../../reducers';
import { connect } from 'react-redux';
import * as userActions from '../../actions/user-actions/user.actions';

interface IProps extends IUserState{
  clearUserInfo: () => any
}

export class AppNav extends React.Component<IProps, any> {

  public constructor(props: any){
    super(props);
  }

  public isAdmin(){
    return (
      <li className="nav-item active dropdown">
        <a className="nav-link dropdown-toggle pointer" id="examples-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Finance Manager Options</a>
        <div className="dropdown-menu" aria-labelledby="examples-dropdown">
          <div className="dropdown-item"><Link to="/pendingRequests" className="unset-anchor nav-link active"> Pending Requests </Link></div>
          <div className="dropdown-item"><Link to="/allRequests" className="unset-anchor nav-link active"> View Request History </Link></div>
          <div className="dropdown-item"><Link to="/allUsers" className="unset-anchor nav-link active"> View Users </Link></div>
          <div className="dropdown-item"><Link to="/register" className="unset-anchor nav-link active"> Register New User </Link></div>
        </div>
      </li>
    );
  }

  public logout= () => {
    this.props.clearUserInfo();
    console.log('User logged out.')
  }

  public render() {
    const userInfo: any=this.props.userInfo || {};
    return (
      <div>
        <nav className="navbar navbar-toggleable-md navbar-expand-lg navbar-light bg-light display-front nav-pad">
          <div className="navbar-header c-pointer shift-left">
            <Link to="/home" className="unset-anchor">
              <img className="img-adjust-position rev-logo" src={ExpendItLogo} alt="revature" />
            </Link>
          </div>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarsExample04">
            <ul className="navbar-nav ml-auto margin-nav">
              <li className="nav-item active">
                <Link to="/home" className="unset-anchor nav-link">Home</Link>
              </li>
              <li className="nav-item active">
                <Link to="/make-a-reimbursement" className="unset-anchor nav-link"> Submit A Request </Link>
              </li>
              <li className="nav-item active">
                <Link to="/view-reimbursements" className="unset-anchor nav-link">
                 View My Requests</Link>
              </li>
              <li className="nav-item active">
                <Link to="/user-information" className="unset-anchor nav-link">
                 User Information</Link>
              </li>
              {userInfo.userRole==='Finance Manager' && this.isAdmin()}
              <li className="nav-item active">
                <Link to="/sign-in" className="unset-anchor nav-link">Sign In</Link>
              </li>
              <li className="nav-item active">
                <Link onClick={this.logout} to="/sign-in" className="unset-anchor nav-link"> Logout </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div >
    );
  }
}

const mapStateToProps = (state: any) => state.user;
const mapDispatchToProps = {
  clearUserInfo: userActions.clearUserInfo
}
export default connect(mapStateToProps, mapDispatchToProps)(AppNav);