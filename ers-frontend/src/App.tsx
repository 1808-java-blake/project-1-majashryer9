import * as React from 'react';
import './App.css';
import './include/bootstrap';
import SubmitARequestComponent from './components/submit-a-request/submit-a-request.component';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomeComponent from './components/home/home.component';
import SignInComponent from './components/sign-in/sign-in.component';
import { Provider } from 'react-redux';
import { store } from './Store';
import RegisterComponent  from './components/finance-manager-options/register/register.component';
import ViewReimbursementsTableComponent from './components/view-reimbursements/view-reimbursements-table.component';
import ViewPendingReimbursementsComponent from './components/finance-manager-options/view-pending-requests/view-pending-requests.component';
import ViewAllUsersComponent from './components/finance-manager-options/all-users/view-all-users.component';
import viewAllRequestsComponent from './components/finance-manager-options/request-history/view-all-requests.component';
import UserInformationComponent from './components/user-information/user-information.component';

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
            <React.Fragment>
              <Switch>
                <Route path="/make-a-reimbursement" component={SubmitARequestComponent} />
                <Route path="/view-reimbursements" component={ViewReimbursementsTableComponent} />
                <Route path="/home" component={HomeComponent} />
                <Route path="/sign-in" component={SignInComponent} />
                <Route path="/register" component={RegisterComponent} />
                <Route path="/pendingRequests" component={ViewPendingReimbursementsComponent} />
                <Route path="/allUsers" component={ViewAllUsersComponent} />
                <Route path="/allRequests" component={viewAllRequestsComponent} />
                <Route path="/user-information" component={UserInformationComponent} />
                <Route component={SignInComponent} />
              </Switch>
            </React.Fragment>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
