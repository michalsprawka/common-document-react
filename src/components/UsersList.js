import React, { Component } from 'react';
import axios from '../axios-base'
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler'
import { Table, Button} from 'react-bootstrap';

class UsersList extends Component {
    state = {
        users: []
    }

    componentDidMount() {
        if(this.props.match.params.groupName==='all'){
            console.log("in users without params")
            axios.get('/api/users/',
            {
                headers: {    
                    'x-auth-token': localStorage.getItem('token')
                }
              }
            ).then((response)=>{
                console.log("RESPONSE: ",response.data)
                this.setState({users: response.data})
                // this.setState({ documents:  response.data.request, 
                                //  itemsCount: response.data.count});
                //     // queryString: "" ,
                  
            })
            .catch(function (error) {
                console.log(error);
              });
        }
        else{
            console.log("in users with params")
            axios.get('/api/users//get-users-in-group/'+this.props.match.params.groupName,
            {
                headers: {    
                    'x-auth-token': localStorage.getItem('token')
                }
              }
            ).then((response)=>{
                console.log("RESPONSE: ",response.data)
                this.setState({users: response.data})
                // this.setState({ documents:  response.data.request, 
                                //  itemsCount: response.data.count});
                //     // queryString: "" ,
                  
            })
            .catch(function (error) {
                console.log(error);
              });
          
        }
    }

    userDeleteHandler = (id)=> {
        console.log("in delete handler", id);
        axios.delete('/api/users/deleteuser/'+id,
        {
            headers: {    
                'x-auth-token': localStorage.getItem('token')
            }
          }
        ).then((response)=>{
            console.log("RESPONSE: ",response)
            window.location.reload(); 
           
              
        })
        .catch(function (error) {
            console.log(error);
          });
       
    }

    render() {
        return (
            <Table striped bordered hover>
            <thead>
              <tr>
                
                <th>Nazwa</th>
                <th>Email</th>
                <th>Komórka</th>
                <th>Kierownik</th>
                <th>Admin</th>
                <th>Akcja</th>
              </tr>
            </thead>
            <tbody>
                {this.state.users.map(
                    el=><tr key={el._id}>
                            <td>{el.name}</td>
                            <td>{el.email}</td>
                            <td>{el.groupName}</td>
                            <td>{el.isManager ? 'TAK' : 'NIE'}</td>
                            <td>{el.isAdmin ? 'TAK' : 'NIE'}</td>
                            <td><Button variant="link" onClick={()=>{this.userDeleteHandler(el._id)}}>Usuń</Button></td>
                        </tr>
                )}
           
             
            </tbody>
          </Table>
       
             
         

        )
    }
}

export default withErrorHandler(UsersList,axios)