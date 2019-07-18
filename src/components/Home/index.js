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

        <Posts />
        <Footer />
    </div>
);

class PostsBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
            loading: false,
            posts: [],
            photo: null,
            uploadValue: 0,
        };

        //this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
    }

    onChangeText = event => {
        this.setState({ text: event.target.value });
    };

    onCreatePosts = (event, authUser) => {
        let userName;
        const refThis = this;
        console.log('photo url' + refThis.state.photo);

        this.props.firebase.users().child(authUser.uid).child('username').once('value')
        .then(function(dataSnapshot) {
            userName = dataSnapshot.val();
        })
        .then(function(){
            refThis.props.firebase.posts().push({
                text: refThis.state.text,
                userId: authUser.uid,
                username: userName,
                time: refThis.props.firebase.serverValue.TIMESTAMP,
                photoUrl: refThis.state.photo,
            });

            refThis.setState({ text: '' });

            event.persist();
        });

    };

    onRemovePost = uid => {
        this.props.firebase.post(uid).remove();
    };

    onEditPost = (post, text) => {
        const { uid, ...postSnapshot } = post;

        this.props.firebase.post(post.uid).set({
            ...postSnapshot,
            text,
            editTime: this.props.firebase.serverValue.TIMESTAMP,
        });
    };

    handlePhotoUpload = event => {
        const file = event.target.files[0];
        const storageRef = this.props.firebase.storageRef(`/photos/${file.name}`);
        const uploadFile = storageRef.put(file)

        const thisUpload = this;
        //console.log(this);

        uploadFile.on('state_changed', snapshot => {
            //console.log(this.state);
            //console.log(thisUpload);
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            thisUpload.setState({
                uploadValue: percentage,
            })
        }, error => {
            console.log(error.message)
        }, () => {
            uploadFile.snapshot.ref.getDownloadURL().then(
                (url) => {
                    console.log(url);
                    thisUpload.setState({
                        uploadValue: 100,
                        photo: url,
                    });
                }
            );
        });
    }


    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.posts().on('value', snapshot => {
            const postObject = snapshot.val();

            if (postObject) {
                const postsList = Object.keys(postObject).map(key => ({
                    ...postObject[key],
                    uid: key,
                }));
                this.setState({
                    posts: postsList,
                    loading: false,
                });
            } else {
                this.setState({ posts: null, loading:false });
            }
        });
    }

    componentWillUnmount() {
        this.props.firebase.posts().off();
    }

    render() {
        const { text, posts, loading } = this.state;

        const noPublish = text === '';

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        <form className="formPost" onSubmit={event => this.onCreatePosts(event, authUser)}>
                            <h4>Poua una historia</h4>
                            <textarea className="createPostArea" type="text" value={text} onChange={this.onChangeText} cols="90" rows="6" placeholder="Comienza a escribir aquí tu historia..."></textarea>
                            <div>
                                <PhotoUpload onUpload={this.handlePhotoUpload} uploadValue={this.state.uploadValue} />
                                <Button className="btnPublish" color="warning" type="submit" disabled={noPublish}>PUBLICAR</Button>
                            </div>
                        </form>

                        {loading && <div>Cargando publicaciones ...</div>}
                        {posts ? (
                            <div>
                                <PostList
                                    authUser={authUser}
                                    posts={posts}
                                    onRemovePost={this.onRemovePost}
                                    onEditPost={this.onEditPost}
                                />
                            </div>
                        ) : (
                            <div>Aún no hay publicaciones ...</div>
                        )}
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

class PostItem extends Component {
    constructor(props) {
        super(props);

        this.state={
            editMode: false,
            editText: this.props.post.text,
        };
    }

    onToggleEditMode = () => {
        this.setState(state => ({
            editMode: !state.editMode,
            editText: this.props.post.text,
        }));
    };

    onChangeEditText = event => {
        this.setState({ editText: event.target.value });
    };

    onSaveEditText = () => {
        this.props.onEditPost(this.props.post, this.state.editText);

        this.setState({ editMode: false });
    };

    render() {
        const { authUser, post, onRemovePost } = this.props;
        const { editMode, editText } = this.state;

        return(
            <li className="post">
                {authUser.uid === post.userId && (
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
                            <Button color="warning" type="button" onClick={() => onRemovePost(post.uid)}><i class="fas fa-trash-alt"></i></Button>
                            //<button type="button" onClick={() => onRemoveMessage(message.uid)}>Eliminar</button>
                        )}
                    </span>
                )}

                {editMode ? (
                    <textarea type="text" value={editText} onChange={this.onChangeEditText}></textarea>
                ) : (
                    <span>
                        <strong>{post.username + " cuenta que..."}</strong>
                        <div className="textPost">
                            {post.text}
                            {post.editTime && <span><strong> (Editado)</strong></span>}
                        </div>
                    </span>
                )}

                <Likes />
            </li>
        );
    }
}


const Posts = withFirebase(PostsBase);

const PostList = ({ authUser, posts, onRemovePost, onEditPost }) => (
    <ul>
        {posts.map(post => (
            <PostItem
                authUser={authUser}
                key={post.uid}
                post={post}
                onRemovePost={onRemovePost}
                onEditPost={onEditPost}
            />
        ))}
    </ul>
);

const condition = authUser => !!authUser;

export default compose(withAuthorization(condition))(HomePage);

export { Button };