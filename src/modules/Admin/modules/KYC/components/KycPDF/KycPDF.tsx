import * as React from 'react';
import './style.scss';


interface IProps {
  pdfURL: string;
}

class KycPDF extends React.Component<IProps> {
  render() {
    return (
      <React.Fragment>
        <div className='text-right'>
            <a href={this.props.pdfURL} target='_blank'>Open in new tab</a>
        </div>
        <embed className='kyc-pdf' src={this.props.pdfURL} />
      </React.Fragment>
    );
  }
}

export default KycPDF;
