import React, { Component } from 'react';
import Input from './UI/Input'
import axios from '../axios-base'
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Modal from './Modal/Modal'

class GroupCreateForm extends Component {
    state = {
       GroupCreateForm: { 
           name: {
                label: "Nazwa",
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Nazwa grupy",
                    disabled: false
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 3
                },
                valid: false
            },
   
        },
        // groups: [],
        formIsValid: false,
        warningPublicModal: false,
    }

  

    checkValidity(value,rules){
        console.log("in check validity",value,rules);
        let isValid=true
        if(rules.required){
            console.log("sprawdzam required");
            isValid= value.trim()!=='' && isValid     
        }
        // if(rules.date_in_future){    
        //     isValid = moment().subtract(1, 'days')<moment(value) && isValid
        // }
        if(rules.minLength){
            console.log("sprawdzam min length");
            isValid = value.length >=rules.minLength && isValid
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid
        }
        console.log("valid?: ",isValid);
        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        console.log("inside inputchangehandler")
        const updatedCreateForm = {
            ...this.state.GroupCreateForm
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

        this.setState({GroupCreateForm: updatedCreateForm, formIsValid: formIsValid});
    }
    addGroupHandler = (event)=> {
        event.preventDefault();
        const formData = {};
        for (let formElementIdentifier in this.state.GroupCreateForm) {
            formData[formElementIdentifier] = this.state.GroupCreateForm[formElementIdentifier].value;

        }
        console.log("Form Data: ", formData);
        console.log("Form valid ?: ", this.state.formIsValid);
        this.setState({warningPublicModal: false})
        axios.post('/api/groups/',
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

    warningPublicHandler = (event)=>{
        event.preventDefault();
        this.setState({ warningPublicModal: true})
    }

    CancelHandler = () => {
        this.setState({ warningPublicModal: false})
    }

    render() {
        const formElementsArray = [];
        
      
        for (let key in this.state.GroupCreateForm) {
        
                formElementsArray.push({
                    id: key,
                    config: this.state.GroupCreateForm[key]
                });
            
        }
        //let form  = null;
        
           let form = (
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
                 <Button style={{margin: '10px'}} disabled={!this.state.formIsValid} type="submit" variant="primary" value="button1" onClick= {this.warningPublicHandler}>Zarejestruj</Button>
                
             
                </Form>
            </Col>
        </Row>
        );
        return (
            <div>
                <h2> Tworzenie Komórki Org.</h2>
            {form}
            <Modal show={this.state.warningPublicModal} modalClosed={this.CancelHandler}>
                   <h3>Czy grupa ma być dodana ?</h3>
                   <span style={{ margin: "10px" }}><button type="submit" value="button1"  className= "btn btn-success btn-sm" onClick={ this.addGroupHandler  } >OK</button></span>
                   <span style={{ margin: "10px" }}><button type="submit" value="button1"  className= "btn btn-success btn-sm" onClick={ this.CancelHandler  } >Cancel</button></span>
                </Modal>
            </div>
        )
    }

}

// export default withErrorHandler(GroupCreateForm,axios)
export default GroupCreateForm