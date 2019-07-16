import React from 'react';
import { withFirebase } from '../Firebase';
import { Button } from 'reactstrap';

const SignOutButton = ({ firebase }) => (
    <Button className="btnSignOut" type="button" onClick={firebase.doSignOut}><i class="fas fa-sign-out-alt"></i> CERRAR SESIÓN</Button>
    //<button className="btnSignOut" type="button" onClick={firebase.doSignOut}>Cerrar sesión</button>
);

export default withFirebase(SignOutButton);

export { Button };