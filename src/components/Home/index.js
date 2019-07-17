import React, { Component } from 'react';
import { compose } from 'recompose';

import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

import './home.css';
import { Button } from 'reactstrap';
import Footer from '../Footer';
import Likes from '../Likes';
import PhotoUpload from '../PhotoUpload';

const HomePage = () => (
    <div>
        {/*<p>Esta página es accesible para todos los usuarios con cuenta de sesión iniciada.</p>*/}

        <Messages />
        <Footer />
    </div>
);

class MessagesBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
            loading: false,
            messages: [],
        };
    }

    onChangeText = event => {
        this.setState({ text: event.target.value });
    };

    onCreateMessage = (event, authUser) => {
        let userName;
        const refThis = this;

        this.props.firebase.users().child(authUser.uid).child('username').once('value')
        .then(function(dataSnapshot) {
            userName = dataSnapshot.val();
            console.log(userName);
        })
        .then(function(){
            console.log('hola' + userName);
            refThis.props.firebase.messages().push({
                text: refThis.state.text,
                userId: authUser.uid,
                username: userName,
                time: refThis.props.firebase.serverValue.TIMESTAMP,
            });

            refThis.setState({ text: '' });

            event.persist();
        });

    };

    onRemoveMessage = uid => {
        this.props.firebase.message(uid).remove();
    };

    onEditPost = (message, text) => {
        const { uid, ...messageSnapshot } = message;

        this.props.firebase.message(message.uid).set({
            ...messageSnapshot,
            text,
            editTime: this.props.firebase.serverValue.TIMESTAMP,
        });
    };

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.messages().on('value', snapshot => {
            const messageObject = snapshot.val();

            if (messageObject) {
                const messageList = Object.keys(messageObject).map(key => ({
                    ...messageObject[key],
                    uid: key,
                }));
                this.setState({
                    messages: messageList,
                    loadinf: false,
                });
            } else {
                this.setState({ messages: null, loading:false });
            }
        });
    }

    componentWillUnmount() {
        this.props.firebase.messages().off();
    }

    render() {
        const { text, messages, loading } = this.state;

        const noPublish = text === '';

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        <form className="formPost" onSubmit={event => this.onCreateMessage(event, authUser)}>
                            <h4>Poua una historia</h4>
                            <textarea className="createPostArea" type="text" value={text} onChange={this.onChangeText} cols="90" rows="6" placeholder="Comienza a escribir aquí tu historia..."></textarea>
                            <div>
                                <PhotoUpload />
                                <Button className="btnPublish" color="warning" type="submit" disabled={noPublish}>PUBLICAR</Button>
                            </div>
                        </form>

                        {loading && <div>Cargando publicaciones ...</div>}
                        {messages ? (
                            <container>
                                <MessageList
                                    authUser={authUser}
                                    messages={messages}
                                    onRemoveMessage={this.onRemoveMessage}
                                    onEditPost={this.onEditPost}
                                />
                            </container>
                        ) : (
                            <div>Aún no hay publicaciones ...</div>
                        )}
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

class MessageItem extends Component {
    constructor(props) {
        super(props);

        this.state={
            editMode: false,
            editText: this.props.message.text,
        };
    }

    onToggleEditMode = () => {
        this.setState(state => ({
            editMode: !state.editMode,
            editText: this.props.message.text,
        }));
    };

    onChangeEditText = event => {
        this.setState({ editText: event.target.value });
    };

    onSaveEditText = () => {
        this.props.onEditPost(this.props.message, this.state.editText);

        this.setState({ editMode: false });
    };

    render() {
        const { authUser, message, onRemoveMessage } = this.props;
        const { editMode, editText } = this.state;

        return(
            <li className="post">
                {authUser.uid === message.userId && (
                    <span className="btnsContainer">
                        {editMode ? (
                            <span>
                                <Button color="warning" onClick={this.onSaveEditText}>Guardar</Button>
                                <Button color="warning" onClick={this.onToggleEditMode}>Cancelar</Button>
                            </span>
                        ) : (
                            <Button color="warning" onClick={this.onToggleEditMode}><i class="fas fa-edit"></i></Button>
                            //<button onClick={this.onToggleEditMode}>Editar</button>
                        )}

                        {!editMode && (
                            <Button color="warning" type="button" onClick={() => onRemoveMessage(message.uid)}><i class="fas fa-trash-alt"></i></Button>
                            //<button type="button" onClick={() => onRemoveMessage(message.uid)}>Eliminar</button>
                        )}
                    </span>
                )}

                {editMode ? (
                    <textarea type="text" value={editText} onChange={this.onChangeEditText}></textarea>
                ) : (
                    <span>
                        <strong>{message.username + " cuenta que..."}</strong>
                        <div className="textPost">
                            {message.text}
                            {message.editTime && <span><strong> (Editado)</strong></span>}
                        </div>
                    </span>
                )}

                <Likes />
            </li>
        );
    }
}


const Messages = withFirebase(MessagesBase);

const MessageList = ({ authUser, messages, onRemoveMessage, onEditPost }) => (
    <ul>
        {messages.map(message => (
            <MessageItem
                authUser={authUser}
                key={message.uid}
                message={message}
                onRemoveMessage={onRemoveMessage}
                onEditPost={onEditPost}
            />
        ))}
    </ul>
);

const condition = authUser => !!authUser;

export default compose(withAuthorization(condition))(HomePage);

export { Button };