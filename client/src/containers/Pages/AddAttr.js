import React, {Component} from 'react';
import AttrForm from '../../components/forms/AttrForm';
import { connect } from 'react-redux';
import { addAttr } from '../../actions/attrActions';

class AddAttrPage extends Component {
  render() {
    const {addAttr, auth} = this.props;
    const {isAuthenticated} = auth;
    const params = {title: 'Add attribute'};
    return (      
      <div className="col-md-4 offset-md-4">
        { isAuthenticated ? 
          <AttrForm
            action={addAttr}
            auth = {auth} 
            params = {params} 
          />  : 
          <div>Login to add a attribute</div>
        }          
      </div>      
    );
  }
}

function mapStateToProps(state){
  return{
    auth: state.auth
  };
}

export default connect(mapStateToProps, {addAttr})(AddAttrPage);