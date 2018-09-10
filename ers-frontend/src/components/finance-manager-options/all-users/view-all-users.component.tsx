import * as React from 'react';
import { IUserState } from '../../../reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { User } from '../../../model/user';
import AppNav from '../../nav/nav.component';

interface IProps extends RouteComponentProps<{}>, IUserState {

}

interface IState {
    users: User[],
    showModal: boolean
}

export class ViewAllUsersComponent extends React.Component<IProps, IState> {

public constructor(props: any){
    super(props);
    this.state={
        users: [],
        showModal: false
    }
}

public openModal= () => {
    this.setState({ showModal: true });
}

public closeModal= () => {
    this.setState({ showModal: false });
}

public delete= (uId: number) => {
    if(confirm(`Are you sure you want to delete this user? 
Deleting this user will also result in deleting all associated
reimbursement requests.`)){
        fetch('http://localhost:8888/users', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                userId: uId
            })
        })
        .then(resp => {
            if(resp.status===200){
                console.log('Successfully deleted user.');
                let newUserArray=this.state.users.filter((user: User) => {
                    return user.userId!==uId;
                })
                this.setState({
                    ...this.state,
                    users: newUserArray
                })
            }
        })
    }
}

public fetchData(){
    fetch('http://localhost:8888/users/all', {
        credentials: 'include'
    })
    .then(resp => resp.json())
    .then(resp => {
        this.setState({
            ...this.state,
            users: resp
        })
    })
    .catch(error => {
        console.log(error);
    })
}

public componentDidMount(){
    this.fetchData();
}

public render() {
    if(!this.props.userInfo){
        this.props.history.push('/sign-in');
    }
    return (
    <React.Fragment>
    <AppNav />
    <table className="table">
        <thead>
            <tr>
                <th scope="col"> First Name </th>
                <th scope="col"> Last Name </th>
                <th scope="col"> Email </th>
                <th scope="col"> User Role </th>
                <th scope="col"> Delete </th>
            </tr>
        </thead>
        <tbody id="users-table-body">
        {
            this.state.users.map((u: User) => (
                <tr key={u.userId}>
                    <td>{u.firstName}</td>
                    <td>{u.lastName}</td>
                    <td>{u.email}</td>
                    <td>{u.userRole}</td>
                    <td>
                    <button onClick={() => this.delete(u.userId)}>Delete User</button>
                    </td>
                </tr>))
        }
        </tbody>
    </table>
    </React.Fragment>
)}
}

const mapStateToProps = (state: any) => state.user;
export default connect(mapStateToProps)(ViewAllUsersComponent);
