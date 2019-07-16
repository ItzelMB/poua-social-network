import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import './signUp.css';
import { Button } from 'reactstrap';

const SignUpPage = () => (
    <div>
        <img className="bannerInicio" alt="banner-inicio" src="https://github.com/ItzelMB/GDL002-social-network/blob/master/public/src/imagenes/inicio-banner.png?raw=true"></img>
        <SignUpForm />
    </div>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { username, email, passwordOne } = this.state;

        this.props.firebase
        .doCreateUserWithEmailAndPassword(email, passwordOne)
        .then(authUser => {
            return this.props.firebase
            .user(authUser.user.uid)
            .set({
                username,
                email,
            });
        })
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
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            username, email, passwordOne, passwordTwo, error,
        } = this.state;

        const isInvalid = passwordOne !== passwordTwo || passwordOne === '' || email === '' || username === '';

        return(
            <form onSubmit={this.onSubmit}>
                <input className="inputSignUp" name="username" value={username} onChange={this.onChange} type="text" placeholder="Nombre completo" autoComplete="off"></input>
                <div><input className="inputSignUp" name="email" value={email} onChange={this.onChange} type="text" placeholder="Correo electrónico" autoComplete="off"></input></div>
                <input className="inputSignUp" name="passwordOne" value={passwordOne} onChange={this.onChange} type="password" placeholder="Contraseña" autoComplete="off"></input>
                <div><input className="inputSignUp" name="passwordTwo" value={passwordTwo} onChange={this.onChange} type="password" placeholder="Confirmar contraseña" autoComplete="off"></input></div>
                {/*<button className="btnSignUp" disabled={isInvalid} type="submit">Registrarse</button>*/}
                <Button className="btnSignUp" color="warning" disabled={isInvalid} type="submit">REGISTRARSE</Button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignUpLink = () => (
    <p className="signUpParr">¿No tienes cuenta? <Link to={ROUTES.SIGN_UP}>Aquí puedes crearla</Link></p>
);

const SignUpForm = compose (
    withRouter,
    withFirebase,
    )(SignUpFormBase);

export default SignUpPage;

export { Button };

export { SignUpForm, SignUpLink };