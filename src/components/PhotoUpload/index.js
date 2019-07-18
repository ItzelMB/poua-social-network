import React, { Component } from 'react';
//import firebase from 'firebase';
import './photoUpload.css';

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
            <React.Fragment>
                {/*<progress value={this.state.uploadValue}></progress>*/}
                <label for="uploadPhoto"><i class="fas fa-file-upload"></i></label>
                <input type="file" id="uploadPhoto" onChange={this.props.onUpload}></input>
                <img src={this.state.photo} alt="" width="450" ></img>
            </React.Fragment>
        )
    }
};

export default PhotoUpload;