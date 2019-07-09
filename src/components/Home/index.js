import React from 'react';
import { withAuthorization } from '../Session';

const HomePage = () => (
    <div>
        <h1>Muro de publicaciones</h1>
        <p>Esta página es accesible para todos los usuarios con cuenta de sesión iniciada.</p>
    </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);