import React, {Component} from 'react';
import './App.css';

import axios from 'axios';
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      success : false,
      url : ""
    }
  }

  handleChange = () => {
    this.setState({success: false, url : ""});

  };

    // Perform the upload
    handleUpload = () => {
        if (!this.uploadInput.files[0]) {
            alert("Select a file before hitting upload button");
            return;
        }

        if (!this.state.programId) {
            alert("Type a program ID before hitting upload button");
            return;
        }

        if (!this.state.fileName) {
            alert("Type a file name before hitting upload button");
            return;
        }

        if (!this.state.path) {
            alert("Select a file type hitting upload button")
        }

        let file = this.uploadInput.files[0];
        // Split the filename to get the name and type
        let fileParts = this.uploadInput.files[0].name.split('.');
        let fileName = this.state.path + "/" + this.state.fileName;
        let fileType = fileParts[1];

        console.log("Preparing the upload", fileName);

        axios.post("http://localhost:3001/sign_s3", {
            fileName : fileName,
            fileType : fileType,
            path: this.state.path
        })
            .then(response => {
                var returnData = response.data.data.returnData;
                var signedRequest = returnData.signedRequest;
                var url = returnData.url;
                this.setState({url: url, s3Path: returnData.s3Path});
                console.log("Received a signed request " + signedRequest);

                // check if file is there
                axios.get(url)
                    .then(result => {
                        console.log(result);
                        alert("File already exists")

                    })
                    .catch(error => {
                        // upload the file if get request fails.
                        // WARNING: get request will return 403 if the file exists but not public. This
                        // over overwrite it.
                        var options = {
                            headers: {
                                'Content-Type': fileType
                            }
                        };
                        axios.put(signedRequest, file, options)
                            .then(result => {
                                this.setState({success: true});
                            })
                            .catch(error => {
                                alert("ERROR " + error);
                            })
                    })
            })
            .catch(error => {
                alert(JSON.stringify(error));
            })
    };

  render() {
    const Success_message = () => (
        <div style={{padding:50}}>
          <h3 style={{color: 'green'}}>SUCCESSFUL UPLOAD</h3>
            <p><a href={this.state.url}>View the file here</a></p>
            <p><a href={this.state.s3Path}>Access the file in s3 here</a></p>
          <br/>
        </div>
    );
    return (
        <div className="App">
            <p>Upload to S3</p>

            <input type="text" placeholder="Enter program ID" onChange={(e) => {
                this.setState({ programId: e.target.value })
            }}/>

            <select onChange={this.selectFileType}>
                <option value="none">Select file type</option>
                <option value="terms">T&C</option>
                <option value="main-header">Header</option>
                <option value="email-logo">Email Logo</option>
                <option value="widget-logo">Widget Logo</option>
            </select>


            <input type="text" placeholder="Enter a file name" onChange={(e) => {
                this.setState({ fileName: e.target.value })
            }} />

            <input onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} type="file"/>
            <br/>
            {this.state.success ? <Success_message/> : null}
            <button onClick={this.handleUpload}>upload</button>
        </div>
    );
  }

  selectFileType = (e) => {
    let selected = e.target.value;

    if (!this.state.programId)  {
        alert("program ID should be selected before selecting the image type to construct the s3 path")
    }

    let paths = {
        "terms":  "terms/" + this.state.programId,
        "main-header": "public/resources/images/program",
        "email-logo": "public/resources/images/program/email",
        "widget-logo": "public/resources/images/program/enrollment_widget"
    };

    this.setState({
        path: paths[selected]
    })
  }
}
export default App;