import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
// import Moment from 'react-moment';
import '../App.css'
import Interval from 'react-interval-rerender'
import {connect} from 'react-redux';

import {Navbar, Nav, NavDropdown, Badge, Form, FormControl, Button, NavItem} from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";

class Navig extends Component  {
  

  render () {

 // console.log("unchoosen in nav", this.props.usrUnchoosenworkerCounter)
 //   console.log("USR con users: ", this.props.usrIsManager);
  //  console.log("USR groups: ", this.props.usrGroups);
  const logged_out_nav = (
   <>
    
      
    <Nav.Link onClick={() => this.props.display_form('login')}>Login</Nav.Link>
         
    </>
  );

  const logged_in_nav = (
   <>
    <LinkContainer to="/seelist/ownerlist">
              <Nav.Link>Nadzorowane </Nav.Link>
     </LinkContainer>
     <LinkContainer to="/seelist/worklist">
              <Nav.Link>Do obsłużenia </Nav.Link>
     </LinkContainer>
    {/* <li><p className="navbar-text span-clickable"><Link  className="link-in-nav"  to='/seelist/ownerlist'>Nadzorowane </Link></p></li> */}
    {/* <li><p className="navbar-text span-clickable"><Link  className="link-in-nav"  to='/seelist/worklist'>Do obsłużenia </Link></p></li> */}
    {/* <li className="li-in-nav"><a href='/seelist/worklist'>Do obsłużenia</a></li> */}
    {this.props.usrIsManager ?
       <>
     <LinkContainer to="/seelist/managerlist">
    
     <Nav.Link>Do przydzielenia </Nav.Link>
     
    </LinkContainer>
    <h6>
    <Badge variant="secondary">{this.props.usrUnchoosenworkerCounter}</Badge>
   </h6>
   </>
     
    // <li className="li-in-nav"><a href='/seelist/managerlist'>Do przydzielenia</a></li>
    // <li><p className="navbar-text span-clickable"><Link  className="link-in-nav"  to='/seelist/managerlist'>Do przydzielenia</Link></p></li>
    : null}
    <NavDropdown title="Utwórz" id="basic-nav-dropdown">
        <LinkContainer to="/create/main">
                  <NavDropdown.Item>Main </NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/create/main4">
                  <NavDropdown.Item>Main4 </NavDropdown.Item>
        </LinkContainer>
     </NavDropdown>

     {this.props.usr.isAdmin ? <NavDropdown title="Panel Admina" id="basic-admin-nav-dropdown">
        <LinkContainer to="/usercreate/">
                  <NavDropdown.Item>utwórz usera </NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/userslist/all">
                  <NavDropdown.Item>lista userów </NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/groupcreate/">
                  <NavDropdown.Item>Dodaj komórkę </NavDropdown.Item>
        </LinkContainer>
        <LinkContainer to="/groupslist/">
                  <NavDropdown.Item>Lista komórek </NavDropdown.Item>
        </LinkContainer>
     
     
     </NavDropdown> : null}
    
     <LinkContainer to="/">
              <Nav.Link onClick={this.props.handle_logout}>Logout </Nav.Link>
     </LinkContainer>
    {/* <li><p className="navbar-text span-clickable"><Link  className="link-in-nav"  to='/create'>Utwórz </Link></p></li> */}
   
    {/* <li><p className="navbar-text span-clickable"><Link className="link-in-nav" to='/' onClick={this.props.handle_logout} >Logout</Link></p></li> */}
    </>
  );
  const date = new Date();
  // const textStyle = {margin : "5px"};
  
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand><LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
      </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
       
    <Nav className="mr-auto">
    {this.props.usrLogin ? logged_in_nav : logged_out_nav}
    </Nav>
    <Navbar.Collapse className="justify-content-end">
      
      <Navbar.Text style = {{margin : "5px"}}>

      {this.props.usrLogin ? this.props.usr.name : "niezalogowany"}
      </Navbar.Text>
     
    
    <Navbar.Text>
    <Interval delay={1000}>
               {() => new Date().toLocaleString()}
                  </Interval>
    </Navbar.Text>
    
  </Navbar.Collapse>
  
</Navbar>
  // <div>
  //   <nav className="navbar navbar-inverse">
  //     <div className="container-fluid">
  //       <div className="navbar-header">
  //       <p className="navbar-text span-clickable"><Link  className="link-in-nav" to='/'>HOME</Link></p>
  //       </div>
  //       <ul className="nav navbar-nav">
  //       {/* <li><p className="navbar-text span-clickable"><Link  className="link-in-nav"  to='/seelist/ownerlist'>Utworzone </Link></p></li>
  //         <li><p className="navbar-text span-clickable"><Link  className="link-in-nav"  to='/seelist/worklist'>Do obsługi </Link></p></li> */}
         
  //         {this.props.usrLogin ? logged_in_nav : logged_out_nav}
  //       </ul>
  //       <ul className="nav navbar-nav navbar-right">
  //       <li> <p className="navbar-text"> <Interval delay={1000}>
  //               {() => new Date().toLocaleString()}
  //                </Interval></p></li>
  //       {/* <li> <p className="navbar-text"> <Moment interval={1000}date={date} /></p></li> */}
  //      <li> <p className="navbar-text"><span className="glyphicon glyphicon-user"></span>{this.props.usrLogin ? this.props.usr.name : "niezalogowany"}</p> </li>
  //       </ul>

  //     </div>
  //   </nav>
 
  
  
  
  
  // </div>
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
export default connect(mapStateToProps)(Navig);

// Nav.propTypes = {
//   // logged_in: PropTypes.bool.isRequired,
//   display_form: PropTypes.func.isRequired,
//   handle_logout: PropTypes.func.isRequired
// };