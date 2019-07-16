import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';

import './navigation.css';

import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth /> : null //<NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

//const NavigationAuth = () => (
//    <ul>
//       {/*<li><Link to={ROUTES.LANDING}>Landing</Link></li>*/}
//        <li><Link to={ROUTES.HOME}>Muro</Link></li>
//       {/*<li><Link to={ROUTES.ADMIN}>Cuenta</Link></li>*/}
//        <li><SignOutButton /></li>
//    </ul>
//);

// const NavigationNonAuth = () => (
//     <ul>
//         {/*<li><Link to={ROUTES.LANDING}>Landing</Link></li>*/}
//         <li><Link to={ROUTES.SIGN_IN}>Iniciar sesión</Link></li>
//     </ul>
// );

class NavigationAuth extends React.Component {
    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
            <div>
                <Navbar light>
                    <NavbarBrand href="/" className="mr-auto"><img className="img-logo" alt="logo" src="https://github.com/ItzelMB/GDL002-social-network/blob/master/public/src/imagenes/logo-poua-app.png?raw=true"></img></NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse isOpen={!this.state.collapsed} navbar>
                        <Nav navbar>
                            <NavItem>
                            <li></li>
                                <NavLink><Link className="link-nav" to={ROUTES.HOME}>IR A PUBLICACIONES</Link></NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink><SignOutButton /></NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
};

class NavigationNonAuth extends React.Component {
    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
            <div>
                <Navbar color="danger" light>
                    <NavbarBrand className="mr-auto"><img className="img-logo" alt="logo" src="https://github.com/ItzelMB/GDL002-social-network/blob/master/public/src/imagenes/logo-poua-app.png?raw=true"></img></NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse isOpen={!this.state.collapsed} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink><Link to={ROUTES.SIGN_IN}>Iniciar sesión</Link></NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}


export default Navigation;

export { NavigationAuth };
export { NavigationNonAuth };