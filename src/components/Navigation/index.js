import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

const Navigation = ({ authUser }) => (
    <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
);

const NavigationAuth = () => (
        <ul>
            <li><Link to={ROUTES.LANDING}>Landing</Link></li>
            <li><Link to={ROUTES.HOME}>Muro</Link></li>
            <li><Link to={ROUTES.ACCOUNT}>Cuenta</Link></li>
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