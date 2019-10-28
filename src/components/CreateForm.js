import React, { Component } from 'react';
import Input from '../components/UI/Input'
import axios from '../axios-base'
// import moment from 'moment';
import moment from 'moment-business-days';
import _ from 'lodash';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
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
        templateArray: [],
       
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
    fetchDocument = () => {axios.get('/api/templates/get-template/'+this.props.match.params.name ,
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
          updatedCreateForm = _.omit(res.data,['addedFieldSchema'])
        //   console.log("data z formu", res.data.date_to.value)
        //   console.log("DATA: ",moment().businessAdd(parseInt(res.data.date_to.value)).format('YYYY-MM-DD'))
          updatedCreateForm.date_to.value = moment().businessAdd(parseInt(res.data.date_to.value), 'days').format('YYYY-MM-DD');
          if(res.data.addedFieldSchema  && res.data.addedFieldSchema.length>0){
              this.setState({templateArray: res.data.addedFieldSchema});
              for(let index in res.data.addedFieldSchema){
                  updatedCreateForm['elem'+index]=res.data.addedFieldSchema[index];
                  if(res.data.addedFieldSchema[index].elementType==="select"){
                    updatedCreateForm['elem'+index].elementConfig.options=this.state.groups;
                  }
              }
          }
          this.setState({CreateForm: updatedCreateForm},()=>{
              console.log("CREATEFORM: ",this.state.CreateForm)
          });
          
        })        
        .catch((err)=> console.log(err))
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
        //   console.log("in create:  ",updatedGroups);
          //updatedGroups=updatedGroups.filter(el=>el.name!=='managment');
          this.setState({groups: updatedGroups},()=>{this.fetchDocument()}); 
        })        
        .catch(()=> console.log("ERROR"))

           
    }

    addBodyHandler = (event) => {
        event.preventDefault();
        let val=this.state.addBodiesCounter
        const updatedForm = {
            ...this.state.CreateForm
        };
        for(let i in this.state.templateArray ){
            updatedForm[`${this.state.templateArray[i].atributeName}${val}`]=this.state.templateArray[i];
        }
        // const updatedState = { ...this.state}; //Sprawdzić
        // let val = updatedState.addBodiesCounter
       
        val++;
        //  const obj1 = {
        //     tableName: "addDescriptionsArray",
        //     index: val,
        //     label: 'Opis',
        //     position: "middle",
        //     atributeName: "description",
        //     elementType: 'textarea',
        //     elementConfig: {
        //         placeholder: 'Test'
        //     },
        //     value: "",
        //     validation: {
        //         required: true
        //     },
        //     valid: false,
        //     visibleOnCreate: true
        // }
        
        // const obj2 = {
        //         index: val,
        //         tableName: "addGroupsArray",
        //         atributeName: "groupName",
        //         label: 'Komórka',
                
        //         position: "bottom",
        //         elementType: 'select',
        //         elementConfig: {
        //             options: this.state.groups,
        //         },
        //         value: "SEE1",
        //         validation: {
                   
        //         },
        //         valid: true,
        //         visibleOnCreate: true
        // } 
       
        console.log("TEMPLATE ARRAY: ", this.state.templateArray);
     
        // updatedForm["dddDesc"+val]=obj1;
        // updatedForm["dddGroup"+val]=obj2;
        

        this.setState({CreateForm: updatedForm,addBodiesCounter: val, formIsValid: false },()=>{
            console.log("Create form after adding body", this.state.CreateForm);
        })
    }

    addDocHandler = (event) => {
        event.preventDefault();
        const formData = {};
        // const addDescriptionsArray = [];
        // const addGroupsArray = [];
        formData["templateName"]=this.props.match.params.name;
        let elementInAddedFieldSchema = {};
        let testArray=[];
        for (let i in this.state.CreateForm) {
            if(this.state.CreateForm[i].type==="single"){
                // console.log("jest single");
                // console.log("in value: ",this.state.CreateForm[i].value)
                formData[i] = this.state.CreateForm[i].value;
            }
            console.log("in cr form: ",this.state.CreateForm[i]);
            if(this.state.CreateForm[i].type!=="single"){
                elementInAddedFieldSchema[this.state.CreateForm[i].atributeName]=this.state.CreateForm[i].value
                if(this.state.CreateForm[i].atributeName==="completed"){
                    testArray.push(elementInAddedFieldSchema);
                    elementInAddedFieldSchema={}
                }
            }
        }
        console.log("Test array: ", testArray);
        // for (let formElementIdentifier in this.state.CreateForm) {
           
        //     if(this.state.CreateForm[formElementIdentifier].type==="single"){
        //     formData[formElementIdentifier] = this.state.CreateForm[formElementIdentifier].value;
        //     }
        //     else {
        //         if(this.state.CreateForm[formElementIdentifier].tableName==="addDescriptionsArray"){
        //             addDescriptionsArray.push({[this.state.CreateForm[formElementIdentifier].atributeName]: this.state.CreateForm[formElementIdentifier].value})
        //         }
        //         if(this.state.CreateForm[formElementIdentifier].tableName==="addGroupsArray"){

        //             addGroupsArray.push({[this.state.CreateForm[formElementIdentifier].atributeName]: this.state.CreateForm[formElementIdentifier].value})
    
        //         }
        //     }
        // }
        // for(let index in addDescriptionsArray){
        //     addDescriptionsArray[index].groupName = addGroupsArray[index].groupName
        // }

        // formData.addedFieldSchema = addDescriptionsArray;
        formData.addedFieldSchema = testArray;
        console.log("FORM DATA: ",formData);
        // console.log("FORM DATA:  ",formData);
        if(event.target.value==="button1"){
            formData.status="PB"
        }
        if(event.target.value==="button2"){
            formData.status="PR"
        }
        console.log("Form data: ", formData)
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
                    if(this.state.CreateForm[key].visibleOnCreate){
                    formElementsArray.push({
                        id: key,
                        config: this.state.CreateForm[key]
                    });
                }
                
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
                
                <h4>Wprowadź nowy dokument</h4>
                
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

  export default connect(mapStateToProps)(withErrorHandler(CreateForm,axios));