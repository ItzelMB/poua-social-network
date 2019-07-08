import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
    <div>
        <h1>SignUp</h1>
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
            this.setState({ ...INITIAL_STATE });
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
                <input name="username" value={username} onChange={this.onChange} type="text" placeholder="Nombre completo"></input>
                <input name="email" value={email} onChange={this.onChange} type="text" placeholder="Correo electrónico"></input>
                <input name="passwordOne" value={passwordOne} onChange={this.onChange} type="password" placeholder="Contraseña"></input>
                <input name="passwordTwo" value={passwordTwo} onChange={this.onChange} type="password" placeholder="Confirmar contraseña"></input>
                <button disabled={isInvalid} type="submit">Registrarse</button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignUpLink = () => (
    <p>¿No tienes cuenta? <Link to={ROUTES.SIGN_UP}>Registrarse</Link></p>
);

const SignUpForm = withFirebase(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };