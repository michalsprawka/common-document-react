import React, { Component } from 'react';
import Input from '../components/UI/Input'
import axios from '../axios-base'
import Modal from '../components/Modal/Modal'
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler'
import {connect} from 'react-redux';
import moment from 'moment-business-days';
import _ from 'lodash';
import {Jumbotron} from 'react-bootstrap';
import * as actionTypes from '../store/actions';
class UpdateForm extends Component {
    // monthFormatted = () => {
    //     const date = new Date();
    //     console.log(date);
    //        const  month = date.getMonth();
    //         console.log(month);
    //         month=month+1
    //     return month < 10 ? ("0" + month) : month;
    //   }
 
    STATUS_LIST = [
        {_id: "PR", name: "Projekt"},
        {_id: "PB", name: "Opublikowany"},
        {_id: "CM", name: "Kompletny"},
        {_id: "CL", name: "Zamknięty"},
        ]
    state = {
       
        CreateForm: { },
        groups: [],
        addBodiesCounter: 0,
        errorMessage: null,
        formIsValid: true,
        warningPublicModal: false,
        owner: "",
        workers:[],
      //  rendered: false


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
    fetchTemplate = () => {axios.get('/api/templates/get-template/'+this.props.match.params.templatename ,
    {
        headers: {    
            'x-auth-token': localStorage.getItem('token')
        }
      } 
    ).then(res => {
      
        //console.log("TEMPLATES:  ",res.data);
        // let updatedCreateForm = {...this.state.CreateForm};
        let updatedCreateForm  =res.data
    //    let updatedCreateForm = _.omit(res.data,['addedFieldSchema'])
       updatedCreateForm.status.elementConfig.options=this.STATUS_LIST; //HMMMMMMM
       // console.log("upd", updatedCreateForm);
        this.setState({CreateForm: updatedCreateForm},()=>{
       //   console.log("CREATEFORM: ",this.state.CreateForm)
      });
      
    })        
    .catch((err)=> console.log(err))
}   
    fetchDocument = () => {
        // console.log("Fetching document!!!!!!!!!!!",this.state.CreateForm)
      //  console.log("props usr:  ", this.props.usr);
        axios.get('/api/docs/detail/'+this.props.match.params.id+'/',
        {
            headers: {    
                'x-auth-token': localStorage.getItem('token')
            }
          } 
        ).then(res => {
            // console.log("Fetching document!!!!!!!!!!!",this.state.CreateForm)
            // console.log("GROUPS: ",this.state.groups)
           // console.log("RES: ",res.data)
            res.data.date_to = res.data.date_to.slice(0,10) //HMMMMMMM
         
            let updatedForm = {...this.state.CreateForm};
            updatedForm.addedFieldSchema = [...this.state.CreateForm.addedFieldSchema]
            let i = 0;
           
            for (let formElementIdentifier in updatedForm) {
            updatedForm[formElementIdentifier].value = res.data[formElementIdentifier]
                if(updatedForm[formElementIdentifier].type==="single"){
                    updatedForm[formElementIdentifier].dsbld=res.data.owner==this.props.usr._id ? false : true;
                }
            }
        //  console.log("UPD form 3", updatedForm);
            let val=this.state.addBodiesCounter //błąd
            for(let element in res.data.addedFieldSchema ){
                
                val++;
              
              
               
                for(;i<updatedForm.addedFieldSchema.length;i++){
                   
                    if(updatedForm.addedFieldSchema[i].atributeName==="groupName"){
                        //console.log("usrGroups: ",this.props.usrGroups);
                        updatedForm.addedFieldSchema[i].elementConfig.options= this.props.usrGroups;
                    }
                    // if(updatedForm.addedFieldSchema[i].atributeName==="worker"){
                    //     // console.log("usrGroups: ",this.props.usrGroups);
                    //     updatedForm.addedFieldSchema[i].elementConfig.options= this.props.usrConUsers;
                    // }
                    updatedForm.addedFieldSchema[i].value=res.data.addedFieldSchema[element][updatedForm.addedFieldSchema[i].atributeName];
                    //TU JESTEM!!!!
                    updatedForm.addedFieldSchema[i].dsbld = res.data.owner==this.props.usr._id ||
                     (updatedForm.addedFieldSchema[i].editableByManager && this.props.usr.isManager && this.props.usr.groupName==res.data.addedFieldSchema[element].groupName)||
                     (updatedForm.addedFieldSchema[i].editableByWorker  && this.props.usr._id==res.data.addedFieldSchema[element].worker)? false : true;
                    //  console.log("atributeName:",updatedForm.addedFieldSchema[i].atributeName);  
                    //  console.log("isManager:",this.props.usr.isManager);
                    // console.log("user group:",this.props.usr.groupName);
                    // console.log("elemeny group group:",res.data.addedFieldSchema[element].groupName);
                    updatedForm[`${updatedForm.addedFieldSchema[i].atributeName}${val}`]= _.cloneDeep(updatedForm.addedFieldSchema[i]);
               
                    if(updatedForm.addedFieldSchema[i].atributeName==="completed"){
             
                        if(updatedForm.addedFieldSchema[i].repeated){
                            i=0;
                          
                        }
                        break;
                    }
                }
   
               
            }
           
            delete updatedForm.addedFieldSchema;
         //   console.log("UPD FORM", updatedForm);
            for(let element in updatedForm){
                //console.log("Form",updatedForm[element])
                updatedForm[element].valid=true;
            }
            
            this.setState({CreateForm: updatedForm,addBodiesCounter: val,owner: res.data.owner ,workers: this.props.usrConUsers},()=>{this.fetchWorkersInGroup()})
           
        }
        ).catch((error)=> console.log(error)) 
    }


    fetchWorkersInGroup=()=>{
       
        // if(workersArray.find(item=>group in item)){
        //     console.log("return");
        //     return;
        // }
        const updState = _.cloneDeep(this.state.CreateForm);
        let gName;
        for(let element in this.state.CreateForm){
            if(this.state.CreateForm[element].atributeName==="groupName"){
             gName=this.state.CreateForm[element].value
            }
            if(this.state.CreateForm[element].atributeName==="worker"){
           //     console.log("in worker");
               
          //  const updState={...this.state.CreateForm,[element]:{...this.state.CreateForm[element],elementConfig:{...this.state.CreateForm[element].elementConfig,options:[this.state.CreateForm[element].elementConfig.options]}}};
          //  console.log("UPD FORM4", updState);
            axios.get('/api/users/get-users-in-group/'+gName,{
            headers: {    
                'x-auth-token': localStorage.getItem('token')
            }
            }).then(res=>{
         //   console.log("res data from fetch worjers: ",res.data);
            updState[element].elementConfig.options = res.data;
        //    console.log("UPD FORM2", updState);
            this.setState({CreateForm: updState});

            // workersArray.push({group: res.data})
            // this.setState({workers: workersArray});
            }).catch((error)=> console.log(error)) 
            }
        }
    }


    componentDidMount () {
        this.fetchTemplate();

        // axios.get('/api/groups/' ,
        // {
        //     headers: {    
        //         'x-auth-token': localStorage.getItem('token')
        //     }
        //   } 
        // ).then(res => {
        // //   console.log(res);
        //   let updatedGroups={...this.state.groups};
          
        //   updatedGroups=res.data;
        //   this.setState({groups: updatedGroups},()=> {this.fetchTemplate();
        // })
          
        
        // })  
    } 

    componentDidUpdate(prevProps, prevState) {
        // console.log("updated see list",this.props.usr, this.state);
       
       
        if(prevState.CreateForm !== this.state.CreateForm && _.isEmpty(prevState.CreateForm)){
        //   console.log("Fetching document!!!!!!!!!!!",this.state.CreateForm)
           this.fetchDocument();     
      }
    //   if(prevState.owner!==this.state.owner){
    //      this.fetchWorkersInGroup();
    // }

    }
    //tu zaczynamy pobierać


    addDocHandler = (event) => {
        event.preventDefault();
        const formData = {};
        // const addDescriptionsArray = [];
        // const addGroupsArray = [];
        formData["templateName"]=this.props.match.params.templatename ;
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
      //  console.log("Test array: ", testArray);
      
        formData.addedFieldSchema = testArray;
     
        if(event.target.value==="button1"){
            formData.status="PB"
        }
     //   console.log("FData",formData);
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
              //  console.log("in response",response);
                axios.get('/api/docs/unchoosencounter',{
                    headers: {
                      'x-auth-token': localStorage.getItem('token')
                  }
                }).then(response => {
                 
               //    console.log("Response in add redux unchoosen", response.data.count)
                   this.props.onGetUnchoosenworkerCounter(response.data.count);
                    
                      
                  })
                  .catch(function (error) {
                    console.log(error);
                  });  
            } )
            .catch( error => {
                this.setState({errorMessage: "some error occured"});
                console.log("ERROR in add ",error);
            } );


           
    }

    DebugHandler = (event) => {
        event.preventDefault();
      //  console.log(this.state.CreateForm)
        
    }

    inputChangedHandler = (event, inputIdentifier) => {
      //  console.log("Checked: ",event.target.checked)

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
        // console.log("check val",updatedFormElement)
        updatedCreateForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for(let inputIdentifier in updatedCreateForm){
            formIsValid = updatedCreateForm[inputIdentifier].valid && formIsValid;
         //   console.log("val",updatedCreateForm[inputIdentifier].valid);

        }
       // console.log("changed element",updatedCreateForm[inputIdentifier])
        if(updatedCreateForm[inputIdentifier].atributeName==="groupName"){
            this.setState({CreateForm: updatedCreateForm, formIsValid: formIsValid},()=>{this.fetchWorkersInGroup()});
        }
        else{
        this.setState({CreateForm: updatedCreateForm, formIsValid: formIsValid});
        }
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
                   // console.log("form array", formElementsArray);
                
            }
        let form = <h3>Nie masz uprawnień do edycji</h3>;
        // console.log("state owner" ,this.state.owner)
       // if(this.state.owner==this.props.usr._id){
            let cnt = 1;
        form = (
            // <div style={{textAlign: "center"}}>
            <form  className="form-horizontal" style={{width: "80%", margin: "auto"}} >
                {formElementsArray.map(formElement => (
                    <div  key={formElement.id}>
                        {formElement.config.atributeName==='description' ? <div style={{margin: "100px"}}><hr /><h4>Element nr {cnt++}</h4></div>:null}
                        {/* {formElement.config.atributeName==='description' ?<div></div> {cnt++} :null} */}
                    <Input 
                        key={formElement.id}
                        label={formElement.config.label}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        disabled={formElement.config.dsbld}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                        {/* {formElement.config.atributeName==='completed' ? </Jumbotron>:null} */}
                        
                    </div>
                ))}
                <div>
                
                    </div>
                 <span style={{ margin: "10px" }}><button  value="button1" disabled={!this.state.formIsValid} className= "btn btn-success btn-sm" onClick={ this.warningPublicHandler  } >Publikuj</button></span>
                 <span><button type="submit" value="button2" disabled={!this.state.formIsValid} className= "btn btn-success btn-sm" onClick={ this.addDocHandler  } >Zapisz</button></span>
            </form>
            // </div>
        );
             //   }
        return (
            <div >
                {errorMessage}
                <Modal show={this.state.warningPublicModal} modalClosed={this.CancelHandler}>
                   <h3>Status dokumentu ustawiony na publiczny</h3>
                   <span style={{ margin: "10px" }}><button type="submit" value="button1"  className= "btn btn-success btn-sm" onClick={ this.addDocHandler  } >OK</button></span>
                   <span style={{ margin: "10px" }}><button type="submit" value="button1"  className= "btn btn-success btn-sm" onClick={ this.CancelHandler  } >Cancel</button></span>
                </Modal>
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
      usrGroups: state.usr.groups,
      usrUnchoosenworkerCounter: state.usr. unchoosenworkerCounter
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
        // onAddUserName: (userData) => dispatch({ type: actionTypes.ADD_USERDATA, userData: userData}),
        // onAddConnectedUsers: (users) => dispatch({ type: actionTypes.ADD_CONNECTED_USERS, connectedUsers: users}),
        // onAddUserGroupId: (id) => dispatch({ type: actionTypes.ADD_USER_GROUP_ID, userGroupId: id}),
        // onUserLogin: () => dispatch({ type: actionTypes.LOGIN}),
        // onUserLogout: () => dispatch({ type: actionTypes.LOGOUT}),
        // onAddGroups: (groups) => dispatch({ type:  actionTypes.ADD_GROUPS, groups: groups }),
        onGetUnchoosenworkerCounter: (cnt) => dispatch({ type: actionTypes.GET_UNCHOOSENWORKER_COUNTER, cnt: cnt}),
    }
  }
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(UpdateForm,axios));