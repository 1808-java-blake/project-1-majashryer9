import * as React from 'react';
import { Reimbursement } from '../../model/reimbursement';
import  AppNav  from '../nav/nav.component';
import { IUserState } from '../../reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

interface IState {
  initialReimbursementDetails: {
    reimbursementAmount: number,
    reimbursementDescription: string,
    reimbursementReceipt: any,
    receiptSrc: any,
    reimbursementType: string
  }
  message: string
}

interface IProps extends RouteComponentProps<{}>, IUserState {}

export class SubmitARequestComponent extends React.Component<IProps, IState> {

  public constructor(props: any){
    super(props);
    this.state={
      initialReimbursementDetails: {
        reimbursementAmount: 0,
        reimbursementDescription: '',
        reimbursementReceipt: {},
        receiptSrc: '',
        reimbursementType: ''
      },
      message: ''
    }
  }

  public updateReimbursementAmount= (e: any) => {
    this.setState({
      ...this.state,
      initialReimbursementDetails: {
        ...this.state.initialReimbursementDetails,
        reimbursementAmount: e.target.value
      }
    })
  }

  public updateReimbursementDescription= (e: any) => {
    this.setState({
      ...this.state,
      initialReimbursementDetails: {
        ...this.state.initialReimbursementDetails,
        reimbursementDescription: e.target.value
      }
    })
  }

  public getFile= (e: any) => {
    const file=e.target.files[0];
    const fReader  = new FileReader();
    fReader.readAsDataURL(file);
    fReader.onload= (loadedFile: any) => {
      const readFile=loadedFile && loadedFile.target.result;
      if(readFile){
        this.setState({
          ...this.state,
          initialReimbursementDetails:{
            ...this.state.initialReimbursementDetails,
            receiptSrc: readFile,
            reimbursementReceipt: readFile
          }
        });
      }
    }
  }

  public updateReimbursementType= (e: any) => {
    this.setState({
      ...this.state,
      initialReimbursementDetails: {
        ...this.state.initialReimbursementDetails,
        reimbursementType: e.target.value
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
    const reimbursementInfo=this.state.initialReimbursementDetails;
    const userInfo: any=this.props.userInfo;
    const userId=userInfo.userId || 0;
    const r: Reimbursement=new Reimbursement(0, reimbursementInfo.reimbursementAmount, 
    new Date().toLocaleString('en-US'), undefined, reimbursementInfo.reimbursementDescription,
    'receipt-placeholder', userId, undefined, 
    reimbursementInfo.reimbursementType, 'Pending');
    fetch(`http://localhost:8888/reimbursements`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(r)
    })
    .then(resp => resp.json())
    .then(resp => {
        if(resp){
          fetch(resp, {
            method: `PUT`,
            body: reimbursementInfo.reimbursementReceipt
          })
          .catch(err => {
            console.log(err);
          })
          this.updateMessage('Reimbursement request successfully submitted.');
          return;
        }
    })
    .catch(err => {
        console.log(err);
    })
  }

  public render() {
    if(!this.props.userInfo){
      this.props.history.push('/sign-in');
    }
    const reimbursementInfo=this.state.initialReimbursementDetails;
    return (
      <React.Fragment>
        <AppNav />
        <div className="userForms">
          <form className="form-signin" onSubmit={this.submit}>
            <h1 className="h3 mb-3 font-weight-normal">Please Input Reimbursement Details </h1>

            <label htmlFor="inputReimbursementAmount"> Enter Reimbursement Amount: </label>
            <input
            onChange={this.updateReimbursementAmount}
            value={reimbursementInfo.reimbursementAmount || ''}
            type="text"
            id="inputReimbursementAmount"
            className="form-control"
            placeholder="Reimbursement Amount"
            required />

            <div className="form-group">
              <label htmlFor="inputReimbursementDescription"> Enter Reimbursement Description: </label>
              <textarea className="form-control" id="inputReimbursementDescription"
              value={reimbursementInfo.reimbursementDescription} 
              onChange={this.updateReimbursementDescription}
              placeholder="Reimbursement Description"></textarea>
            </div>

            
            <label htmlFor="inputReimbursementReceipt"> Add Reimbursement Receipt: </label>
            <input
            onChange={this.getFile}
            type="file"
            id="inputReimbursementReceipt"
            className="form-control"
            placeholder="Reimbursement Receipt" />

            <img id="receiptPreview" src={reimbursementInfo.receiptSrc}/>

            <div className="form-group">
              <label htmlFor="inputReimbursementType"> Choose Reimbursement Type: </label>
              <select onChange={this.updateReimbursementType} className="form-control" id="inputReimbursementType">
                <option> Lodging </option>
                <option> Travel </option>
                <option> Food </option>
                <option> Other </option>
              </select>
            </div>
              <button className="btn btn-lg btn-primary btn-block" type="submit"> Submit </button>
          </form>
          {this.state.message && <p id="message">{this.state.message}</p>}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => state.user;
export default connect(mapStateToProps)(SubmitARequestComponent);