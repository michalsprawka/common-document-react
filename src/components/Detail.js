import React, { Component } from 'react';
import axios from '../axios-base'
import Modal from '../components/Modal/Modal'
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler'
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

class Detail extends Component {

    state = { 
        detail: null,
        confirmModal: false,
        confirmWorkerModal: false,
        confirmCloseModal: false,
        confirmModalId : "",
        confirmMModalIndex: "",
    }
    componentDidMount() {
        console.log("detail redux: ",this.props.usr)
        axios.get('/api/docs/detail/'+this.props.match.params.id+'/',
        {
            headers: {    
                'x-auth-token': localStorage.getItem('token')
            } 
          }
        ).then((response)=>{
             console.log("Data in detail:  ",response.data)
           this.setState({detail: response.data});
            
           
        })
        .catch(function (error) {
            console.log(error);
          });
    }
    componentDidUpdate(prevProps, prevState) {
       if(prevState.detail!==null){
        if( prevState.detail.status!==this.state.detail.status && this.state.detail.status==="CL"){
            console.log(prevState.detail.status);
            console.log("status chaged!!!!");
        }
    }
       
    }
    bodyHandler = (event, index) => { 
        //wywoływany przez onChange na textarea body
       let updatedDetail = {...this.state.detail}
       updatedDetail.addedFieldSchema = [...updatedDetail.addedFieldSchema]
       updatedDetail.addedFieldSchema[index]={...updatedDetail.addedFieldSchema[index]} 
       updatedDetail.addedFieldSchema[index].body = event.target.value;
        this.setState({ detail: updatedDetail});
       // console.log("body chnger:",this.state.detail);
       //console.log("test params:  ",this.props.match.params.id);
       // let updateDetail = { ...this.state.detail, addedFieldSchema: [...addedFieldSchema, [index]: {...addedFieldSchema[index], body: event.target.value}]}
        }

    confirmModalOn = (id, index) => {
        //wywoływane przez przycisk  "Wyślij" wywołuje ono
        this.setState({confirmModal: true, confirmModalId: id, confirmMModalIndex: index})
    }

    updateBodyHandler =(field_id, index) => {
        //wywoływany przez modal potwierdzenia zapisu
        let updatedDetail = {...this.state.detail};
        updatedDetail.addedFieldSchema = [...updatedDetail.addedFieldSchema]
        updatedDetail.addedFieldSchema[index]={...updatedDetail.addedFieldSchema[index]}
        updatedDetail.addedFieldSchema[index].completed = true;
        console.log("update state",updatedDetail)
//this.setState({ detail: updatedDetail,confirmModal: false})
        this.setState({ detail: updatedDetail,confirmModal: false},()=>{ axios.put('/api/docs/changefield-schema/'+this.props.match.params.id+'/'+field_id,
        this.state.detail.addedFieldSchema[index],
        
        {
            headers: {    
                'x-auth-token': localStorage.getItem('token')
            }
          }
        ).then((response)=>{
            console.log("response from added body: ",response);
            // this.props.history.push('/seelist');
            this.props.history.goBack();       
        })
        .catch(function (error) {
            console.log(error);
          });
       });//koniec setState
    }

    workerHandler = (event,index) => {
        //wywoływany przez zmiany w select
       
        let updatedDetail = {...this.state.detail}; //błą∂ immutable NAPRAWIONY
        updatedDetail.addedFieldSchema = [...updatedDetail.addedFieldSchema]
        updatedDetail.addedFieldSchema[index]={...updatedDetail.addedFieldSchema[index]} 
        updatedDetail.addedFieldSchema[index].worker = event.target.value;
        this.setState({ detail: updatedDetail});
    }

    confirmWorkerModalOn = (id, index) => {
        //wywoływany przez przycisk "Zapisz pracownika"
        if(!this.state.detail.addedFieldSchema[index].worker){
            console.log("No worker"); //NIEDOKOŃCZONY
        }
        this.setState({confirmWorkerModal: true, confirmModalId: id, confirmMModalIndex: index})
        
    }
    updateWorkerHandler =(id, index) => {
       //wywoływany przez modal - potwierdzenie przydzielenia
        this.setState({ confirmWorkerModal: false});
        // console.log(event.target.value)
        axios.put('/api/docs/changefield-schema/'+this.props.match.params.id+'/'+id,
        this.state.detail.addedFieldSchema[index],
        {
            headers: {    
                'x-auth-token': localStorage.getItem('token')
            }
          }
        ).then((response)=>{
          
            this.props.history.goBack();   
        })
        .catch(function (error) {
            console.log(error);
          });
    }
    confirmCloseModalOn = () => {
        // wywoływany przez przycisk "Zamknij dokument"
        this.setState({confirmCloseModal: true})
    }

    updateCloseHandler = () => {
        //wywoływany przez modal kończenia pracy przez właściciela
        console.log("inside upd close handler");
        let updatedDetail = {...this.state.detail};
        updatedDetail.status = "CL";
        this.setState({ detail: updatedDetail, confirmCloseModal: false});
        axios.patch('/documents/'+this.props.match.params.id+'/',
        {status: "CL"},
        {
            headers: {    
              'Authorization': `JWT ${localStorage.getItem('token')}`
            }
          }
        ).then((response)=>{
          
            this.props.history.goBack();   
        })
        .catch(function (error) {
            console.log(error);
          }); //Niedokończona wysyłka
    }
    
    
    
    CancelHandler = () => {
        // wywoływany prz Cancel w modalach oraz przez backdrop
        this.setState({confirmModal: false})
        this.setState({confirmWorkerModal: false})
        this.setState({confirmCloseModal: false})
    }
    
    
    print(){
        //wywoływany przez przycisk "Print" W wydruku pomijane są elementy className= "hiddeden print"
        window.print();
    }
    render() {
        // let table = null;
        // if (this.state.detail !== null)
        // {
        console.log("Detail: ",this.state.detail)
        let table=(
            this.state.detail ?
            <div className="table">
                 <Link to= {'/update/'+this.props.match.params.id+'/'+this.state.detail.templateName}>
                    <button style={{ margin: "10px" }} className="btn btn-primary btn-lg" >Edycja</button></Link>
            {this.state.detail.owner==this.props.usr._id ?<div className="hidden-print">

                    {/* <a className="btn btn-primary btn-lg" href={'/update/'+this.props.match.params.id}>Edycja</a> */}
                   
                    {this.state.detail.status!=="CL" ? <button style={{ margin: "10px" }} className="btn btn-primary btn-lg" onClick={this.confirmCloseModalOn}>Zamknij dokument</button> : null}
            </div> : null}
                    {/* <button type="link" href={'/update/'+this.props.match.params.id} className="btn btn-primary btn-lg">Edycja</button> */}
                    {/* <a href={'/update/'+this.props.match.params.id}>EDYTUJ</a> */}
                   <div className="jumbotron jumbotron-in-detail" >
                    <h2>Tytuł: {this.state.detail.title}</h2>
                    <p>Opis:  {this.state.detail.description}</p>
                    <p>Data zakończenia: {this.state.detail.date_to.slice(0,10)}</p>
                    <p>Status:  {this.state.detail.status}</p>
                    </div>

                    
                {this.state.detail.addedFieldSchema.map((el,index) => (
                    <div className="table-row-detail" key={el._id}>
                    <p><strong>Opis: </strong> {el.description}</p>
                    { el.groupName!==this.props.usr.groupName ?
                   
                    <p><strong>Treść: </strong> {el.body}</p>
                    : 
                    <>
                    <p><textarea style = {{ width: "100%" }}  onChange={(event)=>this.bodyHandler(event,index) } value={el.body}></textarea></p>
                    {/* <p><button  className= "btn btn-info btn-sm" onClick={()=> this.updateBodyHandler(el.id, index)}>Wyślij</button></p> */}
                    <p><button  className= "btn btn-info btn-sm" onClick={()=> this.confirmModalOn(el._id, index)}>
                    
                    Wyślij</button></p>
                    {this.props.usrIsManager ? <p><button  className= "btn btn-info btn-sm" onClick={()=> this.confirmWorkerModalOn(el._id, index)}>
                    Przypisz pracownika</button></p> :null}
                    
                    </> 
                    }
                    {el.groupName===this.props.usr.groupName && this.props.usr.isManager ?
                    <select                     
                        value= {el.worker!==null
                        ? el.worker
                        : ""}
                        onChange={(event)=>this.workerHandler(event,index)}>
                        <option value="">Nieprzydzielony </option>
                        {this.props.usrConUsers.map(option => (
                            <option key={option._id} value={option._id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    :
                    null
                    }
                    </div>
                )

                )}
            </div>
            : null
        )
            // : null) ;
              
        return (
            <div>
               <Modal show={this.state.confirmModal} modalClosed={this.CancelHandler}>
                   <h3>Kończysz pracę nad dokumentem. (Dokument zostanie przesłany do właściciela)</h3>
                   <span style={{ margin: "10px" }}><button type="submit" value="button1"  className= "btn btn-success btn-sm" onClick={ ()=>this.updateBodyHandler(this.state.confirmModalId, this.state.confirmMModalIndex)  } >Zapisz</button></span>
                   <span style={{ margin: "10px" }}><button type="submit" value="button2"  className= "btn btn-success btn-sm" onClick={ this.CancelHandler  } >Cancel</button></span>
                </Modal>
                <Modal show={this.state.confirmWorkerModal} modalClosed={this.CancelHandler}>
                   <h3>Dokonano przydziału pracownika do sprawy</h3>
                   <span style={{ margin: "10px" }}><button type="submit" value="button1"  className= "btn btn-success btn-sm" onClick={ ()=>this.updateWorkerHandler(this.state.confirmModalId, this.state.confirmMModalIndex)  } >Zapisz</button></span>
                   <span style={{ margin: "10px" }}><button type="submit" value="button2"  className= "btn btn-success btn-sm" onClick={ this.CancelHandler  } >Cancel</button></span>
                </Modal>
                <Modal show={this.state.confirmCloseModal} modalClosed={this.CancelHandler}>
                   <h3>Praca nad dokumentem będzie zakończona. Dokument powędruje do archiwum </h3>
                   <span style={{ margin: "10px" }}><button type="submit" value="button1"  className= "btn btn-success btn-sm" onClick={ this.updateCloseHandler  } >Zakończ</button></span>
                   <span style={{ margin: "10px" }}><button type="submit" value="button2"  className= "btn btn-success btn-sm" onClick={ this.CancelHandler  } >Cancel</button></span>
                </Modal>
                {table}
                <button className="btn btn-primary hidden-print"
                onClick={this.print}>
                    PRINT
                    </button>

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

export default connect(mapStateToProps)(withErrorHandler(Detail,axios));