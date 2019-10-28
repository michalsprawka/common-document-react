import React, { Component } from 'react';
import '../App.css';
import Modal from '../components/Modal/Modal'
import axios from '../axios-base'
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler'
import {Pagination} from 'react-bootstrap';
import { Table, Button} from 'react-bootstrap';



class SeeList extends Component {
    state = {
        documents: [],
        choosenStatus: [ {id: "PB", name: "Opublikowany"},],
        searchShowModal : false,
        queryString: "",
        unChoosenWorker: true,
        activePage: 1,
        itemsCount: 0
    }
    STATUS_LIST = [
                {id: "PR", name: "Projekt"},
                {id: "PB", name: "Opublikowany"},
                {id: "CM", name: "Kompletny"},
                {id: "CL", name: "Zamknięty"},
                ]

    load_list = () => {
         
        let status_list ="";
        this.state.choosenStatus.map(el=> (
            status_list+="&status="+el.id)
        )

        if(this.state.queryString.length>2){          
            status_list+='&search='+this.state.queryString
        }

        if(this.state.unChoosenWorker){
            status_list+='&unchoosenworker=true'
        }
        status_list+='&page='+this.state.activePage;
        
        axios.get('/api/docs/?listtype='+this.props.match.params.listtype+status_list,
        {
            headers: {    
                'x-auth-token': localStorage.getItem('token')
            }
          }
        ).then((response)=>{
            console.log("RESPONSE: ",response.data)
            this.setState({ documents:  response.data.request, 
                             itemsCount: response.data.count});
            //     // queryString: "" ,
              
        })
        .catch(function (error) {
            console.log(error);
          });
    }

    componentDidMount() {
        console.log("mount see list")
        // console.log("PROPS: ",this.props)
        this.load_list();
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("updated see list",this.props.usr, this.state);
       
        if (prevState.choosenStatus !== this.state.choosenStatus){
          this.load_list();       
        }

        if (prevState.unChoosenWorker !== this.state.unChoosenWorker){
            this.load_list();
          }
          
          if (prevState.activePage !== this.state.activePage){
            this.load_list();
          }
          if (prevProps.match.params.listtype !== this.props.match.params.listtype){
            this.load_list();
          }
          if(prevState.queryString !== this.state.queryString && this.state.queryString===""){
              this.load_list();
          }
              
      }

    detailHandler = (id, templateName) => {
       // this.props.history.push('/detail/'+id)
        this.props.history.push('/update/'+id+'/'+templateName);
    }

    choosen_statusInputHandler = (event,id) => {
        // do poprawy powinien sprawdzać event target,checked ????
        let updateChoosenStatus=[...this.state.choosenStatus];
        if(this.state.choosenStatus.filter(choosen_el => choosen_el.id===id).length>0){
      
            let updateTable=updateChoosenStatus.filter(el => el.id !== id);
            this.setState({choosenStatus: updateTable})
        }
      else{
       
            let choosenObject =this.STATUS_LIST.filter(el => el.id === id)[0];
            updateChoosenStatus.push(choosenObject)
            this.setState({choosenStatus: updateChoosenStatus})
        }
   
    }
    choosen_workerInputHandler = (event) => {
    
        this.setState({unChoosenWorker: event.target.checked})
    }

    CancelHandler = () => {
        this.setState({searchShowModal: false})
    }

    changeQueryStringHandler = (event) => {
        //wywoływany przez onChange na input search
            this.setState({queryString: event.target.value});

    }
    searchHandler = () => {
        //wywoływany przez button search. Łasuje listę wyszukiwań gdy liter wiecej ni dwie
        if(this.state.queryString.length>2){
        this.load_list();
        // this.setState({queryString: ""});
        }
        else{
            this.setState({searchShowModal: true})
        }

    }

    handlePageChange = (pageNumber) => {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
      }
      cancelQueryHandler = () => {
          this.setState({ queryString: "" })
      }

    testPagination = () => {
        console.log("test pagination");
    }
  
    render () {
        // let queryInfo = null;
        // if(this.state.queryString!==""){
        //     queryInfo = (
        //         <h4> Filtr wyszukiwanie: {this.state.queryString} </h4>
        //     );
        // }
        // console.log(this.state.queryString);
        // const today=new Date()


        ///////////////////pagination

        let active = this.state.activePage;
        let itemsSize = (this.state.itemsCount%3) ? (this.state.itemsCount/3)+1 : (this.state.itemsCount/3);
        let items = [];
        for (let number = 1; number <= itemsSize; number++) {
          items.push(
            <Pagination.Item key={number} active={number === active} onClick= {()=>this.handlePageChange(number)}>
              {number}
            </Pagination.Item>,
          );
        }
        
        const paginationBasic = (
          <div>
            {/* <Pagination>{items}</Pagination>
            <br />
        
            <Pagination size="lg">{items}</Pagination>
            <br />
         */}
            <Pagination size="sm">{items}</Pagination>
          </div>
        );



        ////////////////////////////


        let queryInfo = null;
        if(this.state.queryString!==""){

            queryInfo = (
            <div><h4> Fraza wyszukiwana: {this.state.queryString}</h4>
                <button type="link" className= "btn btn-link btn-sm " onClick={this.cancelQueryHandler}>Usuń wyszukiwanie</button></div>
                );
        }
        let table=(
           
            // <div className="table">
            //     {this.state.documents.map( el => {
            //         let classTableRow = ['table-row'] 
            //         let today = new Date();
            //         if (new Date(el.date_to)<today) {
                    
            //             classTableRow.push('out-of-date');
            //         }else if(today.setDate(today.getDate()+3)>=new Date(el.date_to)){
            //             classTableRow.push('warning-date');
            //         }
                    
                    
            //        return (<div className={classTableRow.join(" ")} onClick={()=>this.detailHandler(el._id)} key={el._id}>
            //         <span><strong>Tytuł: </strong> {el.title}</span>
            //         <span><strong>Data zakończenia: </strong> {el.date_to}</span>
            //         <span><strong>Opis: </strong> {el.description}</span>
                    
            //         <span><strong>Status: </strong> {el.status}</span>

            //        </div> )
            //     }
            //     )

            //     }
            // </div>
             <Table striped bordered hover>
             <thead>
               <tr>
                 
                 <th>Nazwa</th>
                 <th>Data zakończenia</th>
                 <th>status
                 </th>
                
               </tr>
             </thead>
             <tbody>
                 {this.state.documents.map(
                     el=><tr className="myTable" onClick={()=>this.detailHandler(el._id, el.templateName)} key={el._id}>
                             <td>{el.title}</td>
                             <td>{el.date_to.slice(0,10)}</td>
                             <td>{this.STATUS_LIST.find(element=>element.id===el.status).name}</td>
                            
                         </tr>
                 )}
            
              
             </tbody>
           </Table>


        );
        let statusSelector = null
        let workerSelector = null
        if(this.props.match.params.listtype==="ownerlist"){
         statusSelector = (<div>
                <span><strong>Filtruj listę: </strong></span>
                {this.STATUS_LIST.map(el => (
                 <label className="checkbox-inline" key={el.id}>
                  <input key={el.id} 
                  id={el.id} 
                  type="checkbox" 
                  name={el.name} 
                  onChange={(event)=>this.choosen_statusInputHandler(event,el.id)}
                  checked={ this.state.choosenStatus.filter(choosen_el=>(choosen_el.id===el.id)).length===0 ? false : true }
                  
                  />
                  <label key={el.name} htmlFor={el.id}>{el.name}</label><br></br>
                </label>
                )
                

                )}
                </div>
            );}
            if(this.props.match.params.listtype==="managerlist"){
               workerSelector=( <div>
                <span><strong>Filtruj listę: </strong></span>
                <label className="checkbox-inline" >
                <input 
                  id="work"
                  type="checkbox" 
                
                  onChange={this.choosen_workerInputHandler}
                  checked={ this.state.unChoosenWorker}
                  
                  />
               
                <label  htmlFor="work">Nieprzydzielone</label><br></br>
                </label>
                </div>);
            }
        const search = (<div>
                        <input 
                        type="text" 
                        placeholder="Szukaj"
                        value={this.state.queryString}
                        onChange={this.changeQueryStringHandler}>
                        </input>
                        <span style={{ margin: "10px" }}><button    className= "btn btn-success btn-sm" onClick={ this.searchHandler  } >Szukaj</button></span>

                        </div>);
        
        return(

            <div>
                 <Modal show={this.state.searchShowModal} modalClosed={this.CancelHandler}>
                   <h3>Słowo wyszukiwane powinno składać się przynajmniej z trzech liter</h3>
                   <button type="button" className="btn btn-info" onClick={this.CancelHandler}>OK</button>
                </Modal>
                {statusSelector}
                {workerSelector}
                {search}
                {queryInfo}
                <h2 className="blue-text">Lista dokumentów</h2>
                {table}
                {paginationBasic}
                <div>
                    {/* <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={3}
                    totalItemsCount={this.state.itemsCount}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange}
                    /> */}
                </div>
            </div>
        );
    }
}

export default withErrorHandler(SeeList,axios)