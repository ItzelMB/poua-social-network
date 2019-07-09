import React, { Component } from 'react';
import { compose } from 'recompose';

import { withAuthorization } from '../Session';
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
            loading: false,
            messages: [],
        };
    }

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
        const { messages, loading } = this.state;

        return (
            <div>
                {loading && <div>Loading ...</div>}
                {messages ? (
                    <MessageList messages={messages} />
                ) : (
                    <div>Aún no hay publicaciones ...</div>
                )}
            </div>
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