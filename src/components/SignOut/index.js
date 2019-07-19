import React from 'react';
import { withFirebase } from '../Firebase';
import { Button } from 'reactstrap';

const SignOutButton = ({ firebase }) => (
    <Button className="btnSignOut" type="button" onClick={firebase.doSignOut}><i class="fas fa-sign-out-alt"></i> CERRAR SESIÓN</Button>
);

export default withFirebase(SignOutButton);

export { Button };