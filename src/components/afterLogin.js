import React from 'react';
import {connect} from 'react-redux';
import Aux from '../hoc/Auxx/Aux'
import * as actionTypes from '../store/actions'
import {Jumbotron} from 'react-bootstrap';


const afterLogin = (props) => (
    <Aux>
    <Jumbotron>
    {/* <h1 className="display-4">Jesteś zalogowany jako {props.username}  </h1> */}
    <h1 className="display-4">Jesteś zalogowany jako {props.usr.name}  </h1>
    <h2>Z menu powyzej mozna wybrać:</h2>
    
        <p> Nadzorowane - aby zobaczyć dokumenty utworzone </p>
        <p> Do obsłuzenia - aby zobaczyć dokumenty wymagające uzupełnienia</p>
        {props.is_manager ? <p>Do przydzielenia - aby prszysdzielić dokument podwładnemu </p> : null}
        <p> Utwórz - aby utworzyć nowy dokument</p>
        <p> Logout - aby wylogować się</p>
    
    </Jumbotron>
    </Aux>
);
const mapStateToProps = state => {
    return {
        usr: state.usr.userData,
        usrIsManager:  state.usr.isManager,
        usrConUsers:  state.usr.connectedUsers
    }
}

export default connect(mapStateToProps)(afterLogin);