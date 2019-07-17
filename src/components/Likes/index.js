import React, { Component } from 'react';
import './likes.css';

class Likes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            likes: 0,
        }
    }

    handleLike = () => {
        this.setState({
            likes: this.state.likes + 1,
        })
    }

    render() {
        return(
            <container className="container">
                <button className="like" onClick={this.handleLike}><i class="fas fa-heart"></i></button>
                <p className="counter">{this.state.likes}</p>
            </container>
        );
    }
};

export default Likes;