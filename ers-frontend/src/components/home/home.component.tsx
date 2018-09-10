import * as React from 'react';
import  AppNav  from '../nav/nav.component';
import { IUserState } from '../../reducers';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';


interface IProps extends RouteComponentProps<{}>, IUserState {

}

export class HomeComponent extends React.Component<IProps, {}> {

  public constructor(props: any){
    super(props);
  }

  public render() {
    if(!this.props.userInfo){
      this.props.history.push('/sign-in');
    }
    return (
      <React.Fragment>
        <AppNav />
      </React.Fragment>

    );
  }
}

const mapStateToProps = (state: any) => state.user;
export default connect(mapStateToProps)(HomeComponent);

