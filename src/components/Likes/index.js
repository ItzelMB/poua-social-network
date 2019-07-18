import React, { Component } from 'react';
import './likes.css';

class Likes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: this.props.post,
        }
    }

    handleLike = () => {
        //const postId = post.uid;
        const postCopy =this.state.post;
        postCopy.likes = postCopy.likes + 1;
        this.setState({ post : postCopy});
        console.log("lie"+this.state.post.uid);
    }

    render() {
        console.log(this.state.post);
        return(
            <container className="container">
                <button className="like" onClick={this.handleLike}><i class="fas fa-heart"></i></button>
                <p className="counter">{this.props.post.likes}</p>
            </container>
        );
    }
};

export default Likes;