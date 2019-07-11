import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = () => (
        <ul>
            <li><Link to={ROUTES.LANDING}>Landing</Link></li>
            <li><Link to={ROUTES.HOME}>Muro</Link></li>
            <li><Link to={ROUTES.ADMIN}>Cuenta</Link></li>
            <li><SignOutButton /></li>
        </ul>
);

const NavigationNonAuth = () => (
    <ul>
        <li><Link to={ROUTES.LANDING}>Landing</Link></li>
        <li><Link to={ROUTES.SIGN_IN}>Iniciar sesión</Link></li>
    </ul>
);

export default Navigation;