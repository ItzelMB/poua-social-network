import React, { Component } from 'react';
import './photoUpload.css';

class PhotoUpload extends Component {

    render(){
        return(
            <React.Fragment>
                <progress value={this.props.uploadValue}></progress>
                <label for="uploadPhoto"><i class="fas fa-file-upload"></i></label>
                <input type="file" id="uploadPhoto" onChange={this.props.onUpload}></input>
            </React.Fragment>
        )
    }
};

export default PhotoUpload;