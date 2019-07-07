import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const Navigation = () => (
    <div>
        <ul>
            <li><Link to={ROUTES.SIGN_IN}>Iniciar sesión</Link></li>
            <li><Link to={ROUTES.LANDING}>Landing</Link></li>
            <li><Link to={ROUTES.HOME}>Muro</Link></li>
            <li><Link to={ROUTES.ACCOUNT}>Cuenta</Link></li>
            <li><Link to={ROUTES.ADMIN}>Administrar</Link></li>
        </ul>
    </div>
);

export default Navigation;