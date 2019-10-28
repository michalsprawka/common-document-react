import React, { Component } from 'react';
import Input from '../components/UI/Input'
import axios from '../axios-base'
import {connect} from 'react-redux';
// import moment from 'moment';
import moment from 'moment-business-days';
import _ from 'lodash';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';

import { Form, Button, Container, Row, Col } from 'react-bootstrap';

class CreateForm extends Component {
   
    today=new Date();
    state = {
        CreateForm: {
            // title: {
                
            //     label: "Nazwa",
            //     type: "single",
            //     position: "up",
            //     elementType: 'input',
            //     elementConfig: {
            //         type: 'text',
            //         placeholder: 'Wprowadź dowolną nazwę',
                   
            //         disabled: false
            //     },
            //     value: '',
            //     validation: {
            //         required: true,
            //         minLength: 5,
            //     },
            //     valid: false
            // },
          
            // description: {
                
            //     label: 'Opis',
            //     type: "single",
            //     position: "up",
            //     elementType: 'textarea',
            //     elementConfig: {
            //         // type: 'text',
            //         placeholder: 'TodoBody'
            //     },
            //     value: '',
            //     validation: {
            //         required: true
            //     },
            //     valid: false
            // },
            // date_to: {
               
            //     label: "termin wykonania",
            //     type: "single",
            //     position: "bottom",
            //     elementType: 'date',
            //     elementConfig: {
            //         type: 'date',            
            //     },
            //     //  value: `${this.today.getFullYear()}-${this.today.getMonth()<9 ? "0": ""}${this.today.getMonth()+1}-${this.today.getDate()}`,
                
            //     // value : moment().add(3, 'days').format('YYYY-MM-DD'),
            //     value : moment().businessAdd(3, 'days').format('YYYY-MM-DD'),
            //     validation: {
            //         required: true,
            //         date_in_future: true
            //     },
            //     valid: true
            // },                   
        },
        groups: [],
        addBodiesCounter: 0,
       
        formIsValid: false
    }

    checkValidity(value,rules){
        let isValid=true
        if(rules.required){
            isValid= value.trim()!=='' && isValid     
        }
        if(rules.date_in_future){    
            isValid = moment().subtract(1, 'days')<moment(value) && isValid
        }
        if(rules.minLength){
            isValid = value.length >=rules.minLength && isValid
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid
        }
        return isValid;
    }
    fetchTemplate = () => {axios.get('/api/templates/get-template/main2' ,
        {
            headers: {    
                'x-auth-token': localStorage.getItem('token')
            }
          } 
        ).then(res => {
          
          console.log("TEMPLATES:  ",res.data);
          let updatedCreateForm = {...this.state.CreateForm};
        //   updatedCreateForm.title=res.data.title;
        //   updatedCreateForm.description=res.data.description;
        //   updatedCreateForm.date_to = res.data.date_to;
        //   updatedCreateForm = _.omit(res.data,['addedFieldSchema'])
        updatedCreateForm  =res.data
        console.log("upd", updatedCreateForm);
          updatedCreateForm.date_to.value = moment().businessAdd(parseInt(res.data.date_to.value), 'days').format('YYYY-MM-DD');
        //   if(res.data.addedFieldSchema  && res.data.addedFieldSchema.length>0){
        //       for(let index in res.data.addedFieldSchema){
        //           updatedCreateForm['elem'+index]=res.data.addedFieldSchema[index];
        //           if(res.data.addedFieldSchema[index].elementType==="select"){
        //             updatedCreateForm['elem'+index].elementConfig.options=this.props.usrGroups;
        //           }
        //       }
        //   }
       
          this.setState({CreateForm: updatedCreateForm},()=>{
              console.log("CREATEFORM: ",this.state.CreateForm)
          });
          
        })        
        .catch((err)=> console.log(err))
    }   

    fetchDocument = ()=> {
       
            console.log("IN FETCH DOC")
        axios.get('/api/docs/detail/'+this.props.match.params.id+'/',
        {
            headers: {    
                'x-auth-token': localStorage.getItem('token')
            } 
          }
        ).then((response)=>{
             console.log("Data in detail:  ",response.data)
             let updatedCreateForm2 = {...this.state.CreateForm};
             for(let index =0;index< response.data.addedFieldSchema.length; index++){
                updatedCreateForm2.addedFieldSchema[0+(index*updatedCreateForm2.addedFieldSchema.length)].value=response.data.addedFieldSchema[index].description;
                
            }
            console.log("Data in detail2:  ",response.data)
            console.log("createform in detail2:  ",updatedCreateForm2)
          
             for (let formElementIdentifier in updatedCreateForm2) {
           
                if(updatedCreateForm2[formElementIdentifier]!=="addedFieldSchema"){
                 updatedCreateForm2[formElementIdentifier].value = response.data[formElementIdentifier]
                
                }
                
                    // if(this.state.CreateForm[formElementIdentifier].tableName==="addDescriptionsArray"){
                    //     addDescriptionsArray.push({[this.state.CreateForm[formElementIdentifier].atributeName]: this.state.CreateForm[formElementIdentifier].value})
                    // }
                    // if(this.state.CreateForm[formElementIdentifier].tableName==="addGroupsArray"){
    
                    //     addGroupsArray.push({[this.state.CreateForm[formElementIdentifier].atributeName]: this.state.CreateForm[formElementIdentifier].value})
                    
        
                    
                }
                updatedCreateForm2.date_to.value = moment().businessAdd(parseInt(response.data.date_to.value), 'days').format('YYYY-MM-DD');
                 for(let index in updatedCreateForm2.addedFieldSchema){
                     console.log("index", index);
                     console.log("index", typeof index);
                     if( index !== 'value'){
                  updatedCreateForm2['elem'+index]=updatedCreateForm2.addedFieldSchema[index];
                  if( updatedCreateForm2.addedFieldSchema[index].elementType==="select"){
                    updatedCreateForm2['elem'+index].elementConfig.options=this.props.usrGroups;
                  }
                }
              }
              delete updatedCreateForm2.addedFieldSchema;
              console.log("Final updated create form ", updatedCreateForm2);
                this.setState({CreateForm: updatedCreateForm2});
            })
        .catch(function (error) {
            console.log(error);
          });
        }
    
       
        componentDidMount () {
       
           this.fetchTemplate();
           
    
               
        }
        componentDidUpdate(prevProps, prevState) {
            // console.log("updated see list",this.props.usr, this.state);
           
           
              if(prevState.CreateForm !== this.state.CreateForm && _.isEmpty(prevState.CreateForm)){
                  console.log("in update compon did update");
               this.fetchDocument();
                  
          }

        }
    

    addBodyHandler = (event) => {
        event.preventDefault();
        // const updatedState = { ...this.state}; //Sprawdzić
        // let val = updatedState.addBodiesCounter
       let val=this.state.addBodiesCounter
        val++;
         const obj1 = {
            tableName: "addDescriptionsArray",
            index: val,
            label: 'Opis',
            position: "middle",
            atributeName: "description",
            elementType: 'textarea',
            elementConfig: {
                placeholder: 'Test'
            },
            value: "",
            validation: {
                required: true
            },
            valid: false
        }
        
        const obj2 = {
                index: val,
                tableName: "addGroupsArray",
                atributeName: "groupName",
                label: 'Komórka',
                
                position: "bottom",
                elementType: 'select',
                elementConfig: {
                    options: this.state.groups,
                },
                value: "SEE1",
                validation: {
                   
                },
                valid: true
        } 
        const updatedForm = {
            ...this.state.CreateForm
        };
       
        updatedForm["dddDesc"+val]=obj1;
        updatedForm["dddGroup"+val]=obj2;

        this.setState({CreateForm: updatedForm,addBodiesCounter: val, formIsValid: false })
    }

    addDocHandler = (event) => {
        event.preventDefault();
        const formData = {};
        const addDescriptionsArray = [];
        const addGroupsArray = [];
        for (let formElementIdentifier in this.state.CreateForm) {
           
            if(this.state.CreateForm[formElementIdentifier].type==="single"){
            formData[formElementIdentifier] = this.state.CreateForm[formElementIdentifier].value;
            }
            else {
                if(this.state.CreateForm[formElementIdentifier].tableName==="addDescriptionsArray"){
                    addDescriptionsArray.push({[this.state.CreateForm[formElementIdentifier].atributeName]: this.state.CreateForm[formElementIdentifier].value})
                }
                if(this.state.CreateForm[formElementIdentifier].tableName==="addGroupsArray"){

                    addGroupsArray.push({[this.state.CreateForm[formElementIdentifier].atributeName]: this.state.CreateForm[formElementIdentifier].value})
    
                }
            }
        }
        for(let index in addDescriptionsArray){
            addDescriptionsArray[index].groupName = addGroupsArray[index].groupName
        }

        formData.addedFieldSchema = addDescriptionsArray;
        console.log("FORM DATA:  ",formData);
        if(event.target.value==="button1"){
            formData.status="PB"
        }
        if(event.target.value==="button2"){
            formData.status="PR"
        }
        axios.post('/api/docs/create',
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

    DebugHandler = (event) => {
        event.preventDefault();
        console.log(this.state.CreateForm)
        
    }

    inputChangedHandler = (event, inputIdentifier) => {

        const updatedCreateForm = {
            ...this.state.CreateForm
        };
        const updatedFormElement = { 
            ...updatedCreateForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid=this.checkValidity(updatedFormElement.value,updatedFormElement.validation)
        // console.log(updatedFormElement)
        updatedCreateForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for(let inputIdentifier in updatedCreateForm){
            formIsValid = updatedCreateForm[inputIdentifier].valid && formIsValid;

        }

        this.setState({CreateForm: updatedCreateForm, formIsValid: formIsValid});
    }

    render () {
        let errorMessage = null;
        // console.log("EM: ",this.state.errorMessage)
        if(this.state.errorMessage){
            errorMessage = (
                <div>
                    <h3> Some error occured {this.state.errorMessage}</h3>
                </div>
            )
        }
        const formElementsArray = [];
        
      
            for (let key in this.state.CreateForm) {
            
                    formElementsArray.push({
                        id: key,
                        config: this.state.CreateForm[key]
                    });
                
            }
        
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
                          <Button variant="link" onClick={this.addBodyHandler}>dodaj pozycję</Button>
      
                     </div>
                     <Button style={{margin: '10px'}} type="submit" variant="primary" value="button1" disabled={!this.state.formIsValid} onClick={ this.addDocHandler  }>Publikuj</Button>
                     <Button type="submit" variant="outline-primary" value="button2" disabled={!this.state.formIsValid} onClick={ this.addDocHandler  }>Zapisz</Button>
                 
                    </Form>
                </Col>
            </Row>
        );
        
        return (
            <div >
                {errorMessage}
                
                <h4>Edytuj dokument</h4>
                
                {form}
            </div>
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
        usrGroups: state.usr.groups
    }
  }

// export default withErrorHandler(CreateForm,axios)

export default connect(mapStateToProps)(withErrorHandler(CreateForm,axios));