import * as React from 'react';
import * as ReactModal from 'react-modal';

interface IProps {
    receipt: any
}

interface IState {
  showModal: boolean
}

ReactModal.setAppElement("#root");

export class ReceiptViewComponent extends React.Component<IProps, IState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      showModal: false
    };
  }
  
  public openModal= () => {
    this.setState({ showModal: true });
  }
  
  public closeModal= () => {
    this.setState({ showModal: false });
  }
  
  public render () {
    return (
      <div>
        <button onClick={this.openModal}> View Receipt </button>
        <ReactModal
          className="Modal" 
          isOpen={this.state.showModal}
          contentLabel="Receipt"
        >
          <img id="receiptImg" src={this.props.receipt} />
          <button className="modalButton" onClick={this.closeModal}> Close </button>
        </ReactModal>
      </div>
    );
  }
}
