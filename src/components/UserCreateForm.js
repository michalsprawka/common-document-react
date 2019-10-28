import React, { Component } from 'react';
import Input from './UI/Input'
import axios from '../axios-base'
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

class UserCreateForm extends Component {
    state = {
       UserCreateForm: { 
           name: {
                label: "Nazwa",
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Imię i Nazwisko",
                    disabled: false
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 5
                },
                valid: false
            },
            email: {
                label: "email",
                elementType: "input",
                elementConfig: {
                    type: "email",
                    placeholder: "adres email",
                    disabled: false
                },
                value: "",
                validation: {
                    required: true,
                    minlength: 5
                },
                valid: false
            },
            password: {
                label: "password",
                elementType: "input",
                elementConfig: {
                    type: "password",
                    placeholder: "hasło",
                    disabled: false
                },
                value: "",
                validation: {
                    required: true,
                    minlength: 5
                },
                valid: false
            },

            isManager: {
                label: "Kierownik ?",
                elementType: "checkbox",
                elementConfig: {
                    type: "checkbox",
                    
                },
                value: false,
                validation: {
                   
                },
                valid: true
            },
            isAdmin: {
                label: "Admin ?",
                elementType: "checkbox",
                elementConfig: {
                    type: "checkbox",
                    
                },
                value: false,
                validation: {
                   
                },
                valid: true
            },
            groupName: {
                label: "Komórka organizacyjna",
                elementType: "select",
                elementConfig: {
                    options: [],
                },
                value: "SEE1",
                validation: {
                   
                },
                valid: true
            }
        },
        groups: [],
        formIsValid: false
    }

    componentDidMount () {
       
        axios.get('/api/groups/' ,
        {
            headers: {    
                'x-auth-token': localStorage.getItem('token')
            }
          } 
        ).then(res => {
          let updatedGroups=res.data;
          let updatedCreateForm = {...this.state.UserCreateForm};
          
          console.log("in create:  ",updatedGroups);
          //updatedGroups=updatedGroups.filter(el=>el.name!=='managment');
          this.setState({groups: updatedGroups},()=>{
              updatedCreateForm.groupName.elementConfig.options = this.state.groups;
              this.setState({UserCreateForm: updatedCreateForm});
          }); 
        })        
        .catch(()=> console.log("ERROR"))

           
    }

    checkValidity(value,rules){
        let isValid=true
        if(rules.required){
            isValid= value.trim()!=='' && isValid     
        }
        // if(rules.date_in_future){    
        //     isValid = moment().subtract(1, 'days')<moment(value) && isValid
        // }
        if(rules.minLength){
            isValid = value.length >=rules.minLength && isValid
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid
        }
        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {

        const updatedCreateForm = {
            ...this.state.UserCreateForm
        };
        const updatedFormElement = { 
            ...updatedCreateForm[inputIdentifier]
        };
        if(updatedFormElement.elementType==="checkbox"){
            console.log("in checkbox if");
            updatedFormElement.value = event.target.checked;
        }
        else{
        updatedFormElement.value = event.target.value;
        }
        updatedFormElement.valid=this.checkValidity(updatedFormElement.value,updatedFormElement.validation)
        // console.log(updatedFormElement)
        updatedCreateForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for(let inputIdentifier in updatedCreateForm){
            formIsValid = updatedCreateForm[inputIdentifier].valid && formIsValid;

        }

        this.setState({UserCreateForm: updatedCreateForm, formIsValid: formIsValid});
    }
    addUserHandler = (event)=> {
        event.preventDefault();
        const formData = {};
        for (let formElementIdentifier in this.state.UserCreateForm) {
            formData[formElementIdentifier] = this.state.UserCreateForm[formElementIdentifier].value;

        }
        console.log("Form Data: ", formData);
        axios.post('/api/users/',
        formData
        ,{
        headers: {    
            'x-auth-token': localStorage.getItem('token')
        }
      }
      ).then( response => {
                console.log("in response",response);
            } )
        .catch( error => {
                console.log("ERROR in add ",error);
            } );
    }

    render() {
        const formElementsArray = [];
        
      
        for (let key in this.state.UserCreateForm) {
        
                formElementsArray.push({
                    id: key,
                    config: this.state.UserCreateForm[key]
                });
            
        }
        let form  = null;
        if(this.state.UserCreateForm.groupName.elementConfig.options.length>0){
            form = (
            <Row>
            <Col md={{ span: 4, offset: 4 }}>
                <Form>
                    {formElementsArray.map(formElement => (
                    <div  key={formElement.id}>
                    <Input 
                        id={formElement.id}
                        key={formElement.id}

                        label={formElement.config.label}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                    </div>
                     ))}
                      <div>
                      
                 </div>
                 <Button style={{margin: '10px'}} type="submit" variant="primary" value="button1" onClick= {this.addUserHandler}>Zarejestruj</Button>
                
             
                </Form>
            </Col>
        </Row>
        )};
        return (
            <div>
                <h2> Tworzenie Usera</h2>
            {form}
            </div>
        )
    }

}

export default withErrorHandler(UserCreateForm,axios)