import React from 'react';
import {Form, Button, Container, Row, Col} from 'react-bootstrap';

// import classes from './Input.css';

const input = ( props ) => {
    let inputElement = null;
    // console.log("PROPS in input: ",props)
    switch ( props.elementType ) {
        case ( 'input' ):
            inputElement = 
            // <div className="col-sm-9">
            // <input
            // id={props.id}
            // className="form-control"
            //     // className={classes.InputElement}
            //     {...props.elementConfig}
               
            //     value={props.value}
            //     onChange={props.changed} />
            //     </div>;
                <Form.Control  id={props.id}  {...props.elementConfig}  value={props.value} onChange={props.changed} disabled={props.disabled}/>
            break;

        case ( 'date' ):
            inputElement = 
            // <div className="col-sm-3">
            // <input
            // className="form-control"
            //     // className={classes.InputElement}
            //     id={props.id}
            //     {...props.elementConfig}
            //     value={props.value}
            //     onChange={props.changed} />
            //     </div>;
            <Form.Control type="text"  id={props.id}  {...props.elementConfig}  value={props.value} onChange={props.changed} disabled={props.disabled}/>
            break;
        case ( 'textarea' ):
            inputElement = 
            // <div className="col-sm-9">
            // <textarea
            // className="form-control"
            //     // className={classes.InputElement}
            //     id={props.id}
            //     {...props.elementConfig}
            //     value={props.value}
            //     onChange={props.changed} />
            //     </div>;
            <Form.Control  as="textarea" rows="3" id={props.id}  {...props.elementConfig}  value={props.value} onChange={props.changed} disabled={props.disabled}/>
            break;
        case ( 'select' ):
            inputElement = (
                // <div className="col-sm-3">
                // <select
                // className="form-control"
                //     // className={classes.InputElement}
                //     id={props.id}
                //     value={props.value}
                //     onChange={props.changed}>
                //     {props.elementConfig.options.map(option => (
                //         <option key={option._id} value={option.name}>
                //             {option.name}
                //         </option>
                //     ))}
                // </select>
                // </div>
                <Form.Control  as="select"  id={props.id}  {...props.elementConfig}  value={props.value} onChange={props.changed} disabled={props.disabled} >
                    {props.value ? null : <option value="">Select your option</option>}
                     {props.elementConfig.options.map(option => (
                        <option key={option._id} value={option._id}>
                            {option.name}
                        </option>
                     ))}
                </Form.Control>
            );
            break;

        case ( 'checkbox' ):
            inputElement = (
                // <div className="col-sm-1">
                // <input
                // className="form-check-input"
                //     // className={classes.InputElement}
                //     id={props.id}
                //     {...props.elementConfig}
                //     checked={props.value} //uwaga !!!!!
                //     // value={props.value}
                //     onChange={props.changed}>                
                // </input>
                // </div>
                <Form.Check id={props.id}  {...props.elementConfig}  checked={props.value} onChange={props.changed} disabled={props.disabled}/>
            );
            break;
        default:
            inputElement = 
            <div className="col-sm-9">
            <input
                 className="form-control"
                 id={props.id}
                // className={classes.InputElement}
                {...props.elementConfig}
                value={props.value}
                disabled={props.disabled}
                onChange={props.changed} />
                </div>;
    }

    return (
      
        // <div className="form-group">
        //     <label style={{textAlign: "right"}} htmlFor={props.id} className="col-sm-3 control-label">{props.label}: </label>          
        //     {inputElement}         
        // </div>

        <Form.Group >
            <Form.Label>{props.label}</Form.Label>
            {inputElement}  
        </Form.Group>
    );

};

export default input;