import React, {Component} from 'react';
import SignupForm from '../../components/forms/SignupForm';
import { connect } from 'react-redux';
import { userSignupRequest} from '../../actions/signupAction';


class SignupPage extends Component {
  render() {
    const { userSignupRequest} = this.props;
    return (
      <div className="">
        <div className="col-md-4 offset-md-4">
          <SignupForm 
            userSignupRequest={userSignupRequest} />
        </div>
      </div>
    );
  }
}

export default connect(null, {userSignupRequest})(SignupPage);
