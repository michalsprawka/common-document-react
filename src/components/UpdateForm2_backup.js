import React, { Component } from 'react';
import Input from '../components/UI/Input'
import axios from '../axios-base'
import Modal from '../components/Modal/Modal'
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler'
import {connect} from 'react-redux';
import moment from 'moment-business-days';

class UpdateForm extends Component {
    // monthFormatted = () => {
    //     const date = new Date();
    //     console.log(date);
    //        const  month = date.getMonth();
    //         console.log(month);
    //         month=month+1
    //     return month < 10 ? ("0" + month) : month;
    //   }
    today=new Date();
    STATUS_LIST = [
        {id: "PR", name: "Projekt"},
        {id: "PB", name: "Opublikowany"},
        {id: "CM", name: "Kompletny"},
        {id: "CL", name: "Zamknięty"},
        ]
    state = {
        CreateForm: {
            title: {
                
                label: "Nazwa",
                type: "single",
                position: "up",
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Wprowadź dowolną nazwę',
                    disabled: false
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                },
                valid: false
            },
         
            description: {
                
                label: 'Opis',
                type: "single",
                position: "up",
                elementType: 'textarea',
                elementConfig: {
                    // type: 'text',
                    placeholder: 'TodoBody'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false
            },
            date_to: {
               
                label: "termin wykonania",
                type: "single",
                position: "bottom",
                elementType: 'input',
                elementConfig: {
                    type: 'date',         
                },
                 value: "",
                validation: {
                    required: true,
                    date_in_future: true
                },
                valid: true
            },
            status: {
               
                label: "status",
                type: "single",
                position: "bottom",
                elementType: 'select',
                elementConfig: {
                    options: this.STATUS_LIST,
                          
                },
                 value: "PR",
                // value: "2018-01-11",
                validation: {
                   
                },
                valid: true
            },
            
            
        },
        groups: [],
        addBodiesCounter: 0,
        errorMessage: null,
        formIsValid: true,
        warningPublicModal: false,
        owner: ""

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
            isValid = value.length >= rules.minLength && isValid
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid
        }
        return isValid;
    }

    fetchDocument = () => {
        axios.get('/api/docs/detail/'+this.props.match.params.id+'/',
        {
            headers: {    
                'x-auth-token': localStorage.getItem('token')
            }
          } 
        ).then(res => {
            console.log("GROUPS: ",this.state.groups)
            console.log("RES: ",res.data)
            // let updatedForm={...this.state.CreateForm}
            let updatedForm={...this.state.CreateForm,
                title: {...this.state.CreateForm.titile,
                value:res.data.title, valid: true},

                description: {...this.state.CreateForm.description,
                value:res.data.description, valid:true},

                date_to: {...this.state.CreateForm.date_to,
                value: res.data.date_to.slice(0,10)},

                status: {...this.state.CreateForm.status,
                value: res.data.status}
                };
            // updatedForm.title.value=res.data.title;
            // updatedForm.title.valid=true;
            // updatedForm.description.value=res.data.description;
            // updatedForm.description.valid=true;
            // updatedForm.date_to.value=res.data.date_to;
            // updatedForm.status.value=res.data.status;
            // updatedForm.owner=res.data.owner;
            let val=this.state.addBodiesCounter //błąd
            for(let element in res.data.addedFieldSchema ){
                
                val++;
                const obj1 = {
                    tableName: "addDescriptionsArray",
                    index: val,
                    label: 'Opis',
                    position: "middle",
                    atributeName: "description",
                    elementType: 'textarea',
        
        
                    elementConfig: {
                        // type: 'text',
                        placeholder: 'Test'
                    },
                    // value: [{title: "a"},{title: 'b'},{title: 'c'}]
                    value: res.data.addedFieldSchema[element].description,
                    id: res.data.addedFieldSchema[element].id, //TYMCZASOWO
                    validation: {
                        required: true
                    },
                    valid: true
                }
                const obj2 = {
                    tableName: "addBodiesArray",
                    index: val,
                    label: 'Odpowiedź',
                    position: "middle",
                    atributeName: "body",
                    elementType: 'textarea',
        
        
                    elementConfig: {
                        // type: 'text',
                        placeholder: 'Test'
                    },
                    // value: [{title: "a"},{title: 'b'},{title: 'c'}]
                    value: res.data.addedFieldSchema[element].body,
                    
                    validation: {
                        required: false
                    },
                    valid: true
                }
                
        
                const obj3 = {
                        index: val,
                        tableName: "addGroupsArray",
                        atributeName: "groupName",
                        label: 'Komórka',
                        
                        position: "bottom",
                        elementType: 'select',
                        elementConfig: {
                            options: this.state.groups,
                        },
                        value: res.data.addedFieldSchema[element].groupNAme,
                        validation: {
                        
                        },
                        valid: true
                }
                
                const obj4 = {
                    index: val,
                    tableName: "addCompletedArray",
                    atributeName: "completed",
                    label: 'Zakończone',
                    
                    position: "bottom",
                    elementType: 'checkbox',
                    elementConfig: {
                      type: "checkbox",
                    //   value: res.data.fields[element].completed,
                    },
                    value: res.data.addedFieldSchema[element].completed,
                    validation: {
                       
                    },
                    valid: true
            } 
                // const updatedForm = {
                //     ...this.state.CreateForm
                // };
            
                console.log("VAL: ",val);
                updatedForm["dddDesc"+val]=obj1;
                updatedForm["dddBody"+val]=obj2;
                updatedForm["dddGroup"+val]=obj3;
                updatedForm["dddComp"+val]=obj4;
            }
            this.setState({CreateForm: updatedForm,addBodiesCounter: val,owner: res.data.owner })
        }
        ).catch((error)=> console.log(error)) 
    }

    componentDidMount () {
        

        axios.get('/api/groups/' ,
        {
            headers: {    
                'x-auth-token': localStorage.getItem('token')
            }
          } 
        ).then(res => {
        //   console.log(res);
          let updatedGroups={...this.state.groups};
          
          updatedGroups=res.data;
          this.setState({groups: updatedGroups},()=> {this.fetchDocument();
        })
          
        
        })  
    } 
    //tu zaczynamy pobierać

    addBodyHandler = (event) => {
        event.preventDefault();
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
                // type: 'text',
                placeholder: 'Test'
            },
            // value: [{title: "a"},{title: 'b'},{title: 'c'}]
            value: "",
            id: -1,
            validation: {
                required: true
            },
            valid: false
        }
        
        const obj2 = {
            tableName: "addBodiesArray",
            index: val,
            label: 'Odpowiedź',
            position: "middle",
            atributeName: "body",
            elementType: 'textarea',


            elementConfig: {
                // type: 'text',
                placeholder: 'Test'
            },
            // value: [{title: "a"},{title: 'b'},{title: 'c'}]
            value: "",
           
            validation: {
                required: false
            },
            valid: true
        }

       

        const obj3 = {
                index: val,
                tableName: "addGroupsArray",
                atributeName: "group",
                label: 'Komórka',
                
                position: "bottom",
                elementType: 'select',
                elementConfig: {
                    options: this.state.groups,
                },
                value: 1,
                validation: {
                   
                },
                valid: true
        } 
       

        const obj4 = {
            index: val,
            tableName: "addCompletedArray",
            atributeName: "completed",
            label: 'Zakończone',
            
            position: "bottom",
            elementType: 'checkbox',
            elementConfig: {
                type: "checkbox"
            },
            value: false,
            validation: {
               
            },
            valid: true
    } 
    const updatedForm = {
        ...this.state.CreateForm
    };
       
        console.log("VAL: ",val);
        updatedForm["dddDesc"+val]=obj1;
        updatedForm["dddBody"+val]=obj2;
        updatedForm["dddGroup"+val]=obj3;
        updatedForm["dddComp"+val]=obj4;
        // updatedTodoForm["dddDesc"+val]=obj2;
        // updatedAddBodiesCounter.addBodiesCounter ++;
        this.setState({CreateForm: updatedForm,addBodiesCounter: val, formIsValid: false })

    }

    addDocHandler = (event) => {
        event.preventDefault();
        console.log("EVENT:  ",event.target.value);
        const formData = {};

        // const fields=[];
        const addDescriptionsArray = [];
        const addBodiesArray = [];
        const addGroupsArray = [];
        const addIdsArray =[]
        const addCompletedArray = []
        for (let formElementIdentifier in this.state.CreateForm) {
           
            if(this.state.CreateForm[formElementIdentifier].type==="single"){
            formData[formElementIdentifier] = this.state.CreateForm[formElementIdentifier].value;
            }
            else {
                if(this.state.CreateForm[formElementIdentifier].tableName==="addDescriptionsArray"){
                    addDescriptionsArray.push({[this.state.CreateForm[formElementIdentifier].atributeName]: this.state.CreateForm[formElementIdentifier].value})
                    addIdsArray.push({id: this.state.CreateForm[formElementIdentifier].id})
                }
                if(this.state.CreateForm[formElementIdentifier].tableName==="addBodiesArray"){
                    addBodiesArray.push({[this.state.CreateForm[formElementIdentifier].atributeName]: this.state.CreateForm[formElementIdentifier].value})
                    
                }
                if(this.state.CreateForm[formElementIdentifier].tableName==="addGroupsArray"){

                    addGroupsArray.push({[this.state.CreateForm[formElementIdentifier].atributeName]: this.state.CreateForm[formElementIdentifier].value})
                    // addGroupsArray.push(1);
                }
                if(this.state.CreateForm[formElementIdentifier].tableName==="addCompletedArray"){

                    addCompletedArray.push({[this.state.CreateForm[formElementIdentifier].atributeName]: this.state.CreateForm[formElementIdentifier].value})
                    // addGroupsArray.push(1);
                }
            
            }
        }
        for(let index in addDescriptionsArray){
            addDescriptionsArray[index].group = addGroupsArray[index].group
            addDescriptionsArray[index].id = addIdsArray[index].id
            addDescriptionsArray[index].body = addBodiesArray[index].body
            addDescriptionsArray[index].completed = addCompletedArray[index].completed
        }

        // console.log(addDescriptionsArray);
        // console.log(addGroupsArray);
        formData.addedFieldSchema = addDescriptionsArray;
        if(event.target.value==="button1"){
            formData.status="PB"
        }
        console.log("FData",formData);
        this.setState({warningPublicModal: false})
        axios.put('/api/docs/'+ this.props.match.params.id+'/',
        formData
       
        ,{
        headers: {    
            'x-auth-token': localStorage.getItem('token')
        }
      }
      )
            .then( response => {
                console.log("in response",response);
            } )
            .catch( error => {
                this.setState({errorMessage: "some error occured"});
                console.log("ERROR in add ",error);
            } );

    }

    DebugHandler = (event) => {
        event.preventDefault();
        console.log(this.state.CreateForm)
        
    }

    inputChangedHandler = (event, inputIdentifier) => {
        console.log("Checked: ",event.target.checked)

        const updatedCreateForm = {
            ...this.state.CreateForm
        };
        const updatedFormElement = { 
            ...updatedCreateForm[inputIdentifier]
        };
        if (updatedFormElement.elementType==="checkbox"){
            updatedFormElement.value = event.target.checked
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

        this.setState({CreateForm: updatedCreateForm, formIsValid: formIsValid});
    }
    CancelHandler = () => {
        this.setState({ warningPublicModal: false})
    }

    warningPublicHandler = (event) => {
        event.preventDefault();
        this.setState({ warningPublicModal: true})
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
        let form = <h3>Nie masz uprawnień do edycji</h3>;
        console.log("state owner" ,this.state.owner)
        if(this.state.owner==this.props.usr._id ){
        form = (
            // <div style={{textAlign: "center"}}>
            <form  className="form-horizontal" style={{width: "80%", margin: "auto"}} >
                {formElementsArray.map(formElement => (
                    <div  key={formElement.id}>
                    <Input 
                        key={formElement.id}
                        label={formElement.config.label}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                    </div>
                ))}
                <div>
                <div className="button-holder">  <button type="link" className= "btn btn-link btn-sm " onClick={this.addBodyHandler}>Dodaj pozycję</button> </div>
                <div className="button-holder">  <button type="link" className= "btn btn-link btn-sm " onClick={this.DebugHandler}>Debug</button> </div>
                    </div>
                 <span style={{ margin: "10px" }}><button  value="button1" disabled={!this.state.formIsValid} className= "btn btn-success btn-sm" onClick={ this.warningPublicHandler  } >Publikuj</button></span>
                 <span><button type="submit" value="button2" disabled={!this.state.formIsValid} className= "btn btn-success btn-sm" onClick={ this.addDocHandler  } >Zapisz</button></span>
            </form>
            // </div>
        );
                }
        return (
            <div >
                {errorMessage}
                <Modal show={this.state.warningPublicModal} modalClosed={this.CancelHandler}>
                   <h3>Status dokumentu ustawiony na publiczny</h3>
                   <span style={{ margin: "10px" }}><button type="submit" value="button1"  className= "btn btn-success btn-sm" onClick={ this.addDocHandler  } >OK</button></span>
                   <span style={{ margin: "10px" }}><button type="submit" value="button1"  className= "btn btn-success btn-sm" onClick={ this.CancelHandler  } >Cancel</button></span>
                </Modal>
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
    }
  }
export default connect(mapStateToProps)(withErrorHandler(UpdateForm,axios));