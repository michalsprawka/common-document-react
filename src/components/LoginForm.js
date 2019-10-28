import React from 'react';
import PropTypes from 'prop-types';
import {Form, Button, Container, Row, Col} from 'react-bootstrap';


class LoginForm extends React.Component {
  state = {
    email: '',
    password: ''
  };

  handle_change = e => {
    const name = e.target.id;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  render() {
    return (
    //   <div style={{textAlign: "center"}}>
    //   {/* <form  style={{width: "30%", margin: "auto"}}onSubmit={e => this.props.handle_login(e, this.state)}>
    //   {/* <h4>Log In</h4> */}
    //   <div className="form-group">
    //   <label htmlFor="email">Uytkownik: </label>
    //   <input
    //     type="text"
    //     id="email"
    //     className="form-control"
    //     value={this.state.email}
    //     onChange={this.handle_change}
    //   />
    //   </div>
    //   <div className="form-group">
    //   <label htmlFor="password">Hasło: </label>
    //   <input
    //     type="password"
    //     id="password"
    //     className="form-control"
    //     value={this.state.password}
    //     onChange={this.handle_change}
    //   />
    //   </div>
    //   <button type="submit" className= "btn btn-success btn-sm">Loguj</button>
    // </form> */}
    
<Container>
  <Row>
    <Col md={{ span: 4, offset: 4 }}>
        <Form  onSubmit={e => this.props.handle_login(e, this.state)}>
          <Form.Group >
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email"  id="email" value={this.state.email} onChange={this.handle_change}/>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group >
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password"  id="password"  value={this.state.password}   onChange={this.handle_change}/>
          </Form.Group>

          <Button variant="primary" type="submit">
            Zaloguj
          </Button>
      </Form>
    </Col>
  </Row>

</Container>
    );
  }
}

export default LoginForm;

LoginForm.propTypes = {
  handle_login: PropTypes.func.isRequired
};