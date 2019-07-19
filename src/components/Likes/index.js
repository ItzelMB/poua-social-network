import React, { Component } from 'react';
import './likes.css';
import { withFirebase } from '../Firebase';

class Likes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: this.props.post,
        }
        console.log(this.props.firebase);
    }

    handleLike = () => {
        //const postId = post.uid;
        const postCopy =this.state.post;
        postCopy.likes = postCopy.likes + 1;

        this.setState({
            post: postCopy
        });

        this.props.firebase.post(this.state.post.uid).set({
            ...this.state.post,
            likes: this.state.post.likes,
        });
    }

    render() {
        return(
            <container className="container">
                <button className="like" onClick={this.handleLike}><i class="fas fa-heart"></i></button>
                <p className="counter">{this.state.post.likes}</p>
            </container>
        );
    }
};

export default withFirebase(Likes);