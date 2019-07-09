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
        this.props.firebase.messages().push({
            text: this.state.text,
            userId: authUser.uid,
        });

        this.setState({ text: '' });

        event.preventDefault();
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
                            <MessageList messages={messages} />
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

const Messages = withFirebase(MessagesBase);

const MessageList = ({ messages }) => (
    <ul>
        {messages.map(message => (
            <MessageItem key={message.uid} message={message} />
        ))}
    </ul>
);

const MessageItem = ({ message }) => (
    <li>
        <strong>{message.userId}</strong> {message.text}
    </li>
);

const condition = authUser => !!authUser;

export default compose(withAuthorization(condition))(HomePage);