import { connect } from 'react-redux';
import { setNumberTabs, getUsers, deleteUser, getTasks, getUsersTasks} from '../actions/adminActions';
import UserTable from '../components/UserTable';

function mapStateToProps(state) {
	return {
		users: state.users
	}
}

function mapDispatchToProps(dispatch) {
	return {

	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTable);
