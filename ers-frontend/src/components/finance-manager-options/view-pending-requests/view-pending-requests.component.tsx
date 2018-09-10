import * as React from 'react';
import { connect } from 'react-redux';
import  AppNav  from '../../nav/nav.component';
import { Reimbursement } from '../../../model/reimbursement';
import { RouteComponentProps } from 'react-router';
import { IUserState } from '../../../reducers';
import { ReceiptViewComponent } from '../../view-reimbursements/receipt-view.component';

interface IState {
    reimbursements: any,
    changedReimbursements: any
}

interface IProps extends RouteComponentProps<{}>, IUserState {

}


export class ViewPendingReimbursementsComponent extends React.Component<IProps, IState> {

constructor(props: any){
    super(props);
    this.state={
        reimbursements: [],
        changedReimbursements: []
    }
}

public changeOrderBy= (e: any) => {
    let sortedReimbursements;
    switch(e.target.value){
        case 'Date Submitted (newest to oldest)':
            sortedReimbursements=this.state.reimbursements.sort((r1: Reimbursement, r2: Reimbursement) => {
                return new Date(r2.reimbursementSubmitted).valueOf()-new Date(r1.reimbursementSubmitted).valueOf();
            })
            this.setState({
                ...this.state,
                reimbursements: sortedReimbursements
            })
            return;
        case 'Date Submitted (oldest to newest)':
            sortedReimbursements=this.state.reimbursements.sort((r1: Reimbursement, r2: Reimbursement) => {
                return new Date(r1.reimbursementSubmitted).valueOf()-new Date(r2.reimbursementSubmitted).valueOf();
            })
            this.setState({
                ...this.state,
                reimbursements: sortedReimbursements
            })
            return;
        case 'Amount (low to high)':
            sortedReimbursements=this.state.reimbursements.sort((r1: Reimbursement, r2: Reimbursement) => {
                return r1.reimbursementAmount-r2.reimbursementAmount;
            })
            this.setState({
                ...this.state,
                reimbursements: sortedReimbursements
            })
            return;
        case 'Amount (high to low)':
            sortedReimbursements=this.state.reimbursements.sort((r1: Reimbursement, r2: Reimbursement) => {
                return r2.reimbursementAmount-r1.reimbursementAmount;
            })
            this.setState({
                ...this.state,
                reimbursements: sortedReimbursements
            })
            return;
    }
}

public select= (reimbursementId: number) =>{
    let withoutReimbursement=this.state.changedReimbursements.filter((rId: number) => {
        return rId!==reimbursementId;
    })
    // reimbursement selected
    if((this.state.changedReimbursements.length-withoutReimbursement.length)%2===0){
        withoutReimbursement.push(reimbursementId);
        this.setState({
            ...this.state,
            changedReimbursements: withoutReimbursement
        })
    }
    else{ // reimbursement unselected
        this.setState({
            ...this.state,
            changedReimbursements: withoutReimbursement
        })
    }
}

public approve= (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const props: any=this.props.userInfo;
    this.state.changedReimbursements.forEach((rId: number) => {
        fetch(`http://localhost:8888/reimbursements`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                reimbursementId: rId,
                reimbursementResolved: new Date().toLocaleString('en-US'),
                reimbursementResolver: props.userId,
                reimbursementStatus: 'Approved'
            })
        })
        .then(resp => {
            if(resp.status===200){
                console.log('Success!');
                let removeNoLongerPending=this.state.reimbursements.map((r: Reimbursement) => {
                    if(r.reimbursementId===rId){
                        r.reimbursementStatus='Approved';
                        return r;
                    }
                    return r;
                })
                this.setState({
                    ...this.state,
                    reimbursements: removeNoLongerPending,
                    changedReimbursements: []
                })
            }
        })
    });
}

public deny= (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const props: any=this.props.userInfo;
    this.state.changedReimbursements.forEach((rId: number) => {
        fetch(`http://localhost:8888/reimbursements`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                reimbursementId: rId,
                reimbursementResolved: new Date().toLocaleString('en-US'),
                reimbursementResolver: props.userId,
                reimbursementStatus: 'Denied'
            })
        })
        .then(resp => {
            if(resp.status===200){
                console.log('Success!');
                let removeNoLongerPending=this.state.reimbursements.map((r: Reimbursement) => {
                    if(r.reimbursementId===rId){
                        r.reimbursementStatus='Denied';
                        return r;
                    }
                    return r;
                })
                this.setState({
                    ...this.state,
                    reimbursements: removeNoLongerPending,
                    changedReimbursements: []
                })
            }
        })
    });

}

public fetchData(){
    fetch(`http://localhost:8888/reimbursements/allPending`,{
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
            reimbursements: newReimbursements
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
                    <th scope="col"> Approve/Deny </th>
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
                this.state.reimbursements.map((reimbursement: any) => (
                    <tr key={reimbursement.reimbursementId}>
                        <td>
                            <input onChange={() => this.select(reimbursement.reimbursementId)} type="checkbox" aria-label="Select" />
                        </td>
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
                    <form className="form-submitApprovals" onSubmit={this.approve}>
                        <button id="approveButton" type="submit">Approve Selected Requests</button>
                    </form>
                    <form className="form-submitApprovals" onSubmit={this.deny}>
                        <button id="denyButton" type="submit">Deny Selected Requests</button>
                    </form>
                </div>
                <div className="col-sm">
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
export default connect(mapStateToProps)(ViewPendingReimbursementsComponent);