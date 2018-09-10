import * as React from 'react';
import { IUserState } from '../../../reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Reimbursement } from '../../../model/reimbursement';
import AppNav from '../../nav/nav.component';
import { ReceiptViewComponent } from '../../view-reimbursements/receipt-view.component';


interface IProps extends RouteComponentProps<{}>, IUserState {

}

interface IState {
    allRequests: any,
    filteredRequests: any
}

export class ViewAllRequestsComponent extends React.Component<IProps, IState> {

    public constructor(props: any){
        super(props);
        this.state={
            allRequests: [],
            filteredRequests: []
        }
    }

    public changeOrderBy= (e: any) => {
        let sortedReimbursements;
        switch(e.target.value){
            case 'Date Submitted (newest to oldest)':
                sortedReimbursements=this.state.filteredRequests.sort((r1: Reimbursement, r2: Reimbursement) => {
                    return new Date(r2.reimbursementSubmitted).valueOf()-new Date(r1.reimbursementSubmitted).valueOf();
                })
                this.setState({
                    ...this.state,
                    filteredRequests: sortedReimbursements
                })
                return;
            case 'Date Submitted (oldest to newest)':
                sortedReimbursements=this.state.filteredRequests.sort((r1: Reimbursement, r2: Reimbursement) => {
                    return new Date(r1.reimbursementSubmitted).valueOf()-new Date(r2.reimbursementSubmitted).valueOf();
                })
                this.setState({
                    ...this.state,
                    filteredRequests: sortedReimbursements
                })
                return;
            case 'Amount (low to high)':
                sortedReimbursements=this.state.filteredRequests.sort((r1: Reimbursement, r2: Reimbursement) => {
                    return r1.reimbursementAmount-r2.reimbursementAmount;
                })
                this.setState({
                    ...this.state,
                    filteredRequests: sortedReimbursements
                })
                return;
            case 'Amount (high to low)':
                sortedReimbursements=this.state.filteredRequests.sort((r1: Reimbursement, r2: Reimbursement) => {
                    return r2.reimbursementAmount-r1.reimbursementAmount;
                })
                this.setState({
                    ...this.state,
                    filteredRequests: sortedReimbursements
                })
                return;
        }
    }
    
    public changeFilterBy= (e: any) => {
        if(e.target.value!=='All'){
            let newFilteredReimbursements=this.state.allRequests.filter((reimbursement:Reimbursement) => {
                return reimbursement.reimbursementStatus===e.target.value;
            })
            this.setState({
                ...this.state,
                filteredRequests: newFilteredReimbursements
            })
        }
        else{
            this.setState({
                ...this.state,
                filteredRequests: this.state.allRequests
            })
        }
    }

    public fetchData(){
        fetch(`http://localhost:8888/reimbursements/all`,{
            credentials: 'include'
        })
        .then(resp => resp.json())
        .then(async resp => {
            let alteredReimbursements= await Promise.all(resp.map((r: Reimbursement) => {
                return fetch(r.reimbursementReceipt)
                .then(resp => resp.text())
                .then(resp => {
                    r.reimbursementReceipt=resp;
                    return r;
                })
                .catch(error => {
                    console.log(error);
                    return r;
                })
            }))
            return alteredReimbursements;
        })
        .then(newReimbursements => {
            this.setState({
                ...this.state,
                allRequests: newReimbursements,
                filteredRequests: newReimbursements
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
                <th scope="col"> Amount </th>
                <th scope="col"> Date Submitted </th>
                <th scope="col"> Date Resolved </th>
                <th scope="col"> Description </th>
                <th scope="col"> Receipt </th>
                <th scope="col"> Author </th>
                <th scope="col"> Type </th>
                <th scope="col"> Status </th>
            </tr>
        </thead>
        <tbody id="reimbursements-table-body">
        {
            this.state.filteredRequests.map((reimbursement: any) => (
                <tr key={reimbursement.reimbursementId}>
                    <td>{reimbursement.reimbursementAmount}</td>
                    <td>{reimbursement.reimbursementSubmitted}</td>
                    <td>{reimbursement.reimbursementResolved}</td>
                    <td>{reimbursement.reimbursementDescription}</td>
                    <td>
                        <ReceiptViewComponent receipt={reimbursement.reimbursementReceipt} />
                    </td>
                    <td>{reimbursement.firstName + ' ' + reimbursement.lastName}</td>
                    <td>{reimbursement.reimbursementType}</td>
                    <td>{reimbursement.reimbursementStatus}</td>
                </tr>))
        }
        </tbody>
    </table>
    <div className="container">
            <div className="row">
                <div className="col-sm">
                    <div className="form-group">
                    <label htmlFor="inputReimbursementType"> Filter By: </label>
                    <select onChange={this.changeFilterBy} className="form-control" id="inputReimbursementType">
                        <option>All</option>
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Denied</option>
                    </select>
                    </div>
                </div>
                <div className="col-sm">
                <div className="form-group">
                    <label htmlFor="inputReimbursementType"> Order By: </label>
                    <select onChange={this.changeOrderBy} className="form-control" id="inputReimbursementType">
                        <option>Date Submitted (newest to oldest)</option>
                        <option>Date Submitted (oldest to newest)</option>
                        <option>Amount (low to high)</option>
                        <option>Amount (high to low)</option>
                    </select>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
)}
}

const mapStateToProps= (state: any) => state.user
export default connect(mapStateToProps)(ViewAllRequestsComponent);