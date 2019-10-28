import React, { Component } from 'react';
import axios from '../axios-base'
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler'
import { Table, Button} from 'react-bootstrap';

class GroupsList extends Component {
    state = {
        groups: []
    }

    componentDidMount() {
        axios.get('/api/groups/',
        {
            headers: {    
                'x-auth-token': localStorage.getItem('token')
            }
          }
        ).then((response)=>{
            console.log("RESPONSE: ",response.data)
            this.setState({groups: response.data})
            // this.setState({ documents:  response.data.request, 
                            //  itemsCount: response.data.count});
            //     // queryString: "" ,
              
        })
        .catch(function (error) {
            console.log(error);
          });
    }

    groupDeleteHandler = (id)=> {
        console.log("in delete handler", id);
        axios.delete('/api/groups/deletegroup/'+id,//UWAGA
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
    getUsersHandler = (name) => {
        this.props.history.push('/userslist/'+name)
    }

    render() {
        return (
            <Table striped bordered hover>
            <thead>
              <tr>
                
                <th>Nazwa</th>
                
              </tr>
            </thead>
            <tbody>
                {this.state.groups.map(
                    el=><tr key={el._id}>
                            <td>{el.name}</td>
                            <td><Button variant="link" onClick={()=>{this.getUsersHandler(el.name)}}>Pokaż pracowników</Button></td>
                            <td><Button variant="link" onClick={()=>{this.groupDeleteHandler(el._id)}}>Usuń</Button></td>
                      
                        </tr>
                )}
           
             
            </tbody>
          </Table>
       
             
         

        )
    }
}

export default withErrorHandler(GroupsList,axios)