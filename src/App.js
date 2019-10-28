import React, { Component } from 'react';
import {connect} from 'react-redux';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

import { Route, BrowserRouter, Switch} from 'react-router-dom';
import SeeList from './components/SeeList';
import Detail from './components/Detail';
import CreateForm from './components/CreateForm';
import UserCreateForm from './components/UserCreateForm';
import GroupCreateForm from './components/GroupCreateForm';

import  UpdateForm from './components/UpdateForm';
import './App.css';
// import Modal from './components/Modal/Modal';
import axios from './axios-base';
import Spinner from './components/UI/Spinner/Spinner';
import withErrorHandler from './hoc/withErrorHandler/withErrorHandler';
import AfterLogin from './components/afterLogin';
import * as actionTypes from './store/actions';
import {Pagination} from 'react-bootstrap';
import UsersList from './components/UsersList';
import GroupsList from './components/GroupList'



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
      displayed_form: 'login',
     
      loading: false,
      
    };
  }
  
  componentDidMount() {

     
    if (this.props.usrLogin) {
     
      axios.get('/api/users/me',{
          headers: {
            'x-auth-token': localStorage.getItem('token')
        }
      }).then(response => {
       
         
            this.props.onAddUserName(response.data)
            this.props.onAddConnectedUsers(response.data.connectedUsers);
            this.props.onGetUnchoosenworkerCounter();
          
            
        })
        .catch(function (error) {
          console.log(error);
        });

        axios.get('/api/groups',{
          headers: {
            'x-auth-token': localStorage.getItem('token')
        }
      }).then(response => {
       
         console.log("Response in add groups", response)
         this.props.onAddGroups(response.data)

         axios.get('/api/docs/unchoosencounter',{
          headers: {
            'x-auth-token': localStorage.getItem('token')
        }
      }).then(response => {
       
         console.log("Response in add redux unchoosen", response.data.count)
         this.props.onGetUnchoosenworkerCounter(response.data.count);
          
            
        })
        .catch(function (error) {
          console.log(error);
        });
          
            
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("updated see list",this.props.usr, this.state);
   
   
      if(prevState.displayed_form !== this.state.displayed_form && this.state.displayed_form===''){
        console.log("wywołanie update groups")
        axios.get('/api/groups',{
          headers: {
            'x-auth-token': localStorage.getItem('token')
        }
      }).then(response => {
       
         console.log("Response in add groups", response)
         this.props.onAddGroups(response.data)

         axios.get('/api/docs/unchoosencounter',{
          headers: {
            'x-auth-token': localStorage.getItem('token')
        }
      }).then(response => {
       
         console.log("Response in add redux unchoosen", response.data.count)
         this.props.onGetUnchoosenworkerCounter(response.data.count);
          
            
        })
        .catch(function (error) {
          console.log(error);
        });
      

        
          
            
        })
        .catch(function (error) {
          console.log(error);
        });
       
      }
          
  }
     
  

  handle_login = (e, data) => {
    console.log("IN LOGIN");
    e.preventDefault();
    this.setState( { loading: true } );
    axios.post('/api/auth/', data,{
      
      headers: {
        'Content-Type': 'application/json'
      }
    })  
      .then(response => {
        console.log("RESPONSE: ",response.data.token);
        this.setState( { loading: false } );
        if(response.data.token !== undefined){
        localStorage.setItem('token', response.data.token);
        }
        this.setState({
         
          displayed_form: '',
         
        });
        this.props.onUserLogin();
        this.props.onAddUserName(response.data.user) 
        this.props.onAddConnectedUsers(response.data.user.connectedUsers);//dodano REDUX
        console.log("From Redux in handle login: ", this.props.usr, this.props.usrIsManager, this.props.usrConUsers)
        console.log("token:",localStorage.getItem('token'))
      })
      .catch((error) =>{
        console.log(error);
         this.setState({loading: false})

      });

   
  };

  

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
    this.props.onUserLogout();
  };

  display_form = form => {
    console.log("display_form");
    this.setState({
      displayed_form: form
    });
  };



  render() {
    
    let active = 2;
let items = [];
for (let number = 1; number <= 5; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>,
  );
}

const paginationBasic = (
  <div>
    <Pagination>{items}</Pagination>
    <br />

    <Pagination size="lg">{items}</Pagination>
    <br />

    <Pagination size="sm">{items}</Pagination>
  </div>
);

    let form;
    let error = null;
    switch (this.state.displayed_form) {
      case 'login':
        form =  this.props.usrLogin ? null : <LoginForm handle_login={this.handle_login} /> ;
        break;
     
      default:
        form = null;
    }
    if ( this.state.loading ) {
      form = <Spinner />;
  }
   

    return (
    <BrowserRouter>
      <div className="App">
   
        <Nav
         
          display_form={this.display_form}
          handle_logout={this.handle_logout}
         

        />
         <h3>
          {this.props.usrLogin
            ? null
            : 'Proszę się zalogować'}
        </h3>
        {form}
      
        {error}
        <Switch>
          <Route path='/seelist/:listtype' component={SeeList}/>
          <Route path='/detail/:id' component={Detail}/>
          <Route path='/update/:id/:templatename' component={UpdateForm}/>
          <Route path='/create/:name' component={CreateForm}/> 
          {/* <Route path='/update/:id' component={CreateForm}/>  */}
          <Route path='/usercreate/' component={UserCreateForm}/> 
          <Route path='/groupcreate/' component={GroupCreateForm}/> 
        
          <Route path='/userslist/:groupName' component={UsersList}/> 
          {/* <Route path='/userslist/' component={UsersList}/>  */}
          <Route path='/groupslist/' component={GroupsList}/> 
          
          {this.props.usrLogin ?
            <Route path='/' component={AfterLogin}/> 
          : null}
        </Switch>
       
      </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
      usr: state.usr.userData,
      usrIsManager:  state.usr.isManager,
      usrConUsers:  state.usr.connectedUsers,
      usrGroupId: state.usr.userGroupId,
      usrLogin: state.usr.logged_in,
      usrGroups: state.usr.groups,
      usrUnchoosenworkerCounter: state.usr. unchoosenworkerCounter
  }
}

const mapDispatchToProps = dispatch => {
  return {
      onAddUserName: (userData) => dispatch({ type: actionTypes.ADD_USERDATA, userData: userData}),
      onAddConnectedUsers: (users) => dispatch({ type: actionTypes.ADD_CONNECTED_USERS, connectedUsers: users}),
      onAddUserGroupId: (id) => dispatch({ type: actionTypes.ADD_USER_GROUP_ID, userGroupId: id}),
      onUserLogin: () => dispatch({ type: actionTypes.LOGIN}),
      onUserLogout: () => dispatch({ type: actionTypes.LOGOUT}),
      onAddGroups: (groups) => dispatch({ type:  actionTypes.ADD_GROUPS, groups: groups }),
      onGetUnchoosenworkerCounter: (cnt) => dispatch({ type: actionTypes.GET_UNCHOOSENWORKER_COUNTER, cnt: cnt}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(App,axios));