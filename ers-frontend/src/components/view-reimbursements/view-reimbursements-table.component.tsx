import * as React from 'react';
import { IUserState } from '../../reducers';
import { connect } from 'react-redux';
import  AppNav  from '../nav/nav.component';
import { Reimbursement } from '../../model/reimbursement';
import { RouteComponentProps } from 'react-router';
import { ReceiptViewComponent } from './receipt-view.component';

interface IState {
    allReimbursements: any,
    filteredReimbursements: any
}

interface IProps extends RouteComponentProps<{}>, IUserState {

}

export class ViewReimbursementsTableComponent extends React.Component<IProps, IState> {

constructor(props: any){
    super(props);
    this.state={
        allReimbursements: [],
        filteredReimbursements: []
    }
}

public changeOrderBy= (e: any) => {
    let sortedReimbursements;
    switch(e.target.value){
        case 'Date Submitted (newest to oldest)':
            sortedReimbursements=this.state.filteredReimbursements.sort((r1: Reimbursement, r2: Reimbursement) => {
                return new Date(r2.reimbursementSubmitted).valueOf()-new Date(r1.reimbursementSubmitted).valueOf();
            })
            this.setState({
                ...this.state,
                filteredReimbursements: sortedReimbursements
            })
            return;
        case 'Date Submitted (oldest to newest)':
            sortedReimbursements=this.state.filteredReimbursements.sort((r1: Reimbursement, r2: Reimbursement) => {
                return new Date(r1.reimbursementSubmitted).valueOf()-new Date(r2.reimbursementSubmitted).valueOf();
            })
            this.setState({
                ...this.state,
                filteredReimbursements: sortedReimbursements
            })
            return;
        case 'Amount (low to high)':
            sortedReimbursements=this.state.filteredReimbursements.sort((r1: Reimbursement, r2: Reimbursement) => {
                return r1.reimbursementAmount-r2.reimbursementAmount;
            })
            this.setState({
                ...this.state,
                filteredReimbursements: sortedReimbursements
            })
            return;
        case 'Amount (high to low)':
            sortedReimbursements=this.state.filteredReimbursements.sort((r1: Reimbursement, r2: Reimbursement) => {
                return r2.reimbursementAmount-r1.reimbursementAmount;
            })
            this.setState({
                ...this.state,
                filteredReimbursements: sortedReimbursements
            })
            return;
    }
}

public changeFilterBy= (e: any) => {
    if(e.target.value!=='All'){
        let newFilteredReimbursements=this.state.allReimbursements.filter((reimbursement:Reimbursement) => {
            return reimbursement.reimbursementStatus===e.target.value;
        })
        this.setState({
            ...this.state,
            filteredReimbursements: newFilteredReimbursements
        })
    }
    else{
        this.setState({
            ...this.state,
            filteredReimbursements: this.state.allReimbursements
        })
    }
}

public delete= (rId: number) => {
    if(confirm('Are you sure you want to delete this request?')){
        fetch('http://localhost:8888/reimbursements', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              reimbursementId: rId
            })
          })
          .then(resp => {
            if(resp.status===200){
              console.log('Successfully deleted');
              let newFiltered=this.state.filteredReimbursements.filter((r: Reimbursement) => {
                  return r.reimbursementId!=rId
              })
              let newAll=this.state.allReimbursements.filter((r: Reimbursement) => {
                  return r.reimbursementId!=rId
              })
              this.setState({
                  ...this.state,
                  filteredReimbursements: newFiltered,
                  allReimbursements: newAll
              })
            }
          })
          .catch(error => {
            console.log(error);
          })
    }
}

public deleteRequest= (status: string, rId: number) => {
    if(status==='Pending'){
        return (
            <button onClick={() => this.delete(rId)}>Delete Reimbursement</button>
        )
    }
    return (
        <p> Not pending </p>
    )
}

public fetchData(){
    const props: any=this.props;
    const userId: number=props.userInfo.userId;
    fetch(`http://localhost:8888/reimbursements?userId=${userId}`,{
        credentials: 'include'
    })
    .then(resp => resp.json())
    .then(async resp => {
        let alteredReimbursements= await Promise.all(resp.map((r: Reimbursement) => {
            return fetch(r.reimbursementReceipt)
            .then(resp => resp.text())
            .then(resp => {
                console.log(r.reimbursementSubmitted);
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
            allReimbursements: newReimbursements,
            filteredReimbursements: newReimbursements
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
                    <th scope="col"> Resolver </th>
                    <th scope="col"> Type </th>
                    <th scope="col"> Status </th>
                    <th scope="col"> Delete </th>

                </tr>
            </thead>
            <tbody id="reimbursements-table-body">
            {
                this.state.filteredReimbursements.map((reimbursement: any) => (
                    <tr key={reimbursement.reimbursementId}>
                        <td>{reimbursement.reimbursementAmount}</td>
                        <td>{reimbursement.reimbursementSubmitted}</td>
                        <td>{reimbursement.reimbursementResolved}</td>
                        <td>{reimbursement.reimbursementDescription}</td>
                        <td>
                            <ReceiptViewComponent receipt={reimbursement.reimbursementReceipt}/>
                        </td>
                        <td>{reimbursement.firstName + ' ' + reimbursement.lastName}</td>
                        <td>{reimbursement.reimbursementType}</td>
                        <td>{reimbursement.reimbursementStatus}</td>
                        <td>{this.deleteRequest(reimbursement.reimbursementStatus, reimbursement.reimbursementId)}</td>
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
    );
}
}
const mapStateToProps = (state: any) => state.user;
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewReimbursementsTableComponent);