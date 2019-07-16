import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import './signIn.css';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { Button } from 'reactstrap';

const SignInPage = () => (
    <div>
        <img className="bannerInicio" alt="banner-inicio" src="https://github.com/ItzelMB/GDL002-social-network/blob/master/public/src/imagenes/inicio-banner.png?raw=true"></img>
        <SignInForm />
        <SignUpLink />
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <form className="formLogin" onSubmit={this.onSubmit}>
                <div><input className="inputLogin" name="email" value= {email} onChange={this.onChange} type="text" placeholder="Correo electrónico" autoComplete="off"></input></div>
                <div><input className="inputLogin" name="password" value= {password} onChange={this.onChange} type="password" placeholder="Contraseña" autoComplete="off"></input></div>
                <Button color="warning" className="btnLogin" disabled={isInvalid} type="submit" >INICIAR SESIÓN</Button>
                {/*<button disabled={isInvalid} type="submit" >Iniciar sesión</button>*/}
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
export { Button };