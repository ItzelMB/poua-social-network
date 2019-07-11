import React, { Component } from 'react';
import { compose } from 'recompose';

import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

const HomePage = () => (
    <div>
        <h1>Muro de publicaciones</h1>
        {/*<p>Esta página es accesible para todos los usuarios con cuenta de sesión iniciada.</p>*/}

        <Messages />
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

        this.props.firebase.users().child(authUser.uid).child('username').once('value')
        .then(function(dataSnapshot) {
            userName = dataSnapshot.val();
            console.log(userName);
        });
        console.log('hola' + userName);

        this.props.firebase.messages().push({
            text: this.state.text,
            userId: authUser.uid,
            username: userName,
            time: this.props.firebase.serverValue.TIMESTAMP,
        });

        this.setState({ text: '' });

        event.preventDefault();
    };

    onRemoveMessage = uid => {
        this.props.firebase.message(uid).remove();
    };

    onEditPost = (message, text) => {
        const { uid, ...messageSnapshot } = message;

        this.props.firebase.message(message.uid).set({
            ...messageSnapshot,
            text,
            time: this.props.firebase.serverValue.TIMESTAMP,
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

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        {loading && <div>Loading ...</div>}
                        {messages ? (
                            <MessageList
                                authUser={authUser}
                                messages={messages}
                                onRemoveMessage={this.onRemoveMessage}
                                onEditPost={this.onEditPost}
                                />
                        ) : (
                            <div>Aún no hay publicaciones ...</div>
                        )}

                        <form onSubmit={event => this.onCreateMessage(event, authUser)}>
                            <input type="text" value={text} onChange={this.onChangeText}></input>
                            <button type="submit">Publicar</button>
                        </form>
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
            <li>
                {editMode ? (
                    <input type="text" value={editText} onChange={this.onChangeEditText}></input>
                ) : (
                    <span>
                        <strong>{message.userId}</strong> {message.text}
                        {message.time && <span>(Editado)</span>}
                    </span>
                )};

                {authUser.uid === message.userId && (
                    <span>
                        {editMode ? (
                            <span>
                                <button onClick={this.onSaveEditText}>Guardar</button>
                                <button onClick={this.onToggleEditMode}>Cancelar</button>
                            </span>
                        ) : (
                            <button onClick={this.onToggleEditMode}>Editar</button>
                        )}

                        {!editMode && (
                            <button type="button" onClick={() => onRemoveMessage(message.uid)}>Eliminar</button>
                        )}
                    </span>
                )}
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