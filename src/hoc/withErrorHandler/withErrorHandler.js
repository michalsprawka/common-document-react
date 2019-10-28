import React, { Component } from 'react';

import Modal from '../../components/Modal/Modal';
import Aux from '../Auxx/Aux';

const withErrorHandler = ( WrappedComponent, axios ) => {
    return class extends Component {
        state = {
            error: null
        }

        componentWillMount () {
            this.reqInterceptor = axios.interceptors.request.use( req => {
                this.setState( { error: null } );
               // console.log("req in error", req);
                return req;
            } );
            this.resInterceptor = axios.interceptors.response.use( res =>  res, 
                error => {
               
                //console.log("error in error", error.response);
                this.setState( { error: error.response } );
            } );
        }

        componentWillUnmount () {
            axios.interceptors.request.eject( this.reqInterceptor );
            axios.interceptors.response.eject( this.resInterceptor );
        }

        errorConfirmedHandler = () => {
            this.setState( { error: null } );
        }

        render () {
            return (
                <Aux>
                    <Modal
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                           
                        {this.state.error ? this.state.error.data.err : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }
}

export default withErrorHandler;