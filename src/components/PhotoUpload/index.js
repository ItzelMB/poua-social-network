import React, { Component } from 'react';
//import firebase from 'firebase';

class PhotoUpload extends Component {
    constructor() {
        super();

        this.state = {
            uploadValue: 0,
            photo: null,
        };
    }

    render(){
        return(
            <container>
                <progress value={this.state.uploadValue}></progress>
                <input type="file" onChange={this.props.onUpload} placeholder="Sube una foto"></input>
                <img src={this.state.photo} alt="" width="450" ></img>
            </container>
        )
    }
};

export default PhotoUpload;