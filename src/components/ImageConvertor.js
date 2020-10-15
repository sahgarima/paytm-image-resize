import React, { PureComponent } from 'react';
import Preview from './Preview';
import { withRouter } from "react-router-dom";
import firebase from 'firebase/app'
import 'firebase/storage'
import storage from "../firebase"
import Loader from 'react-loader-spinner'

var _ = require('lodash');
// import '../dist/ReactCrop.css';



export default withRouter(class ImageConvertor extends PureComponent {
    constructor(props) {
        super(props)
        this.checkFilled = this.checkFilled.bind(this)
    }
    state = {
        src: null,
        previews: [{ name: "horizontal", sizes: { width: "755", height: "450" } }, { name: "vertical", sizes: { width: "365", height: "450" } }, { name: "horizontal-small", sizes: { width: "365", height: "212" } }, { name: "gallery", sizes: { width: "380", height: "380" } }],
        files: [],
        isReady: false,
        msg: "",
        count: 0,
        loading: false
    };
    updateCropedImages = (key, val) => {
        // console.log(key)
        const arr = this.state.files;
        const index = this.checkFilled(key)
        if (index != -1) {
            arr[index] = val
        } else {
            arr.push(val)
        }

        this.setState({ files: arr, count: this.state.count++ }, function () {
            if (this.state.files.length == 4) {
                this.setState({ isReady: true, msg: "" })

            }
        });
    }
    onSelectFile = e => {

        if (e.target.files && e.target.files.length > 0) {
            localStorage.setItem('imageName', e.target.files[0].name);
            const reader = new FileReader();
            let _this = this
            reader.onload = function (e) {
                var img = new Image;

                img.onload = function () {
                    if (img.width == 1024 && img.height == 1024) {
                        _this.setState({ src: reader.result, msg: "Lets start and crop the images to the smaller size " });
                    } else {
                        alert(`Error:Image should be 1024*1024`);
                    }

                };
                img.src = reader.result;
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    };


    onUploadSubmission(e) {
        this.setState({ loading: true })
        e.preventDefault(); // prevent page refreshing
        const promises = [];
        this.state.files.forEach(file => {
            const name = localStorage.getItem('imageName');

            const uploadTask = firebase.storage().ref().child(`Cropped/${name}/${file.fileName}`).put(file);
            promises.push(uploadTask);
            uploadTask.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                snapshot => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (snapshot.state === firebase.storage.TaskState.RUNNING) {
                        console.log(`Progress: ${progress}%`);
                    }
                },
                error => console.log(error.code),
                async () => {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    // do something with the url
                }
            );
        });
        Promise.all(promises)
            .then(() => { alert('All files uploaded'); this.props.history.push('/page') })
            .catch(err => console.log(err.code));

    }

    onFileChange(e) {
        let arr = []
        for (let i = 0; i < e.target.files.length; i++) {
            const newFile = e.target.files[i];
            newFile["id"] = Math.random();
            arr.push(newFile)
            // add an "id" property to each File object

        }
        this.setState({ files: arr }, function () {
            // console.log(this.state.files)
        });

    };
    checkFilled(name) {
        return _.findIndex(this.state.files, function (chr) {
            return chr.fileName == `${name}.jpeg`;
        });
    }

    render() {
        // var foundValue = this.state.files.find(obj=>obj.fileName==='horizontal.jpeg');
        //         if (!this.state.loading) {
        //             return (<Loader type="Circles" color="#00BFFF" height={80} width={80}/>
        // )
        //         } else {
        return (
            <>
                {this.state.loading &&
                    <div className="popup"><Loader type="Circles" color="#00BFFF" height={80} width={80} /></div>
                }
                <div className="container">

                    <div className="row">
                        <div className="col">
                            <div className="form-group row pt-5">
                                {/* <label className="col-sm-2 col-form-label">Select Image</label> */}
                                <div className="col-sm-6">
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" onChange={this.onSelectFile} id="customFileLang" lang="es" accept="image/png,image/gif,image/jpeg" />
                                        <label className="custom-file-label">Select Image</label>
                                    </div>
                                </div>
                                {
                                    this.state.isReady && (
                                        <div className="col-sm-6 text-right">
                                            <button className="btn btn-success" onClick={this.onUploadSubmission.bind(this)}>Create WebPage</button>
                                        </div>
                                    )
                                }

                            </div>
                        </div>

                    </div>
                    {this.state.msg &&
                        (<div className="row pt-3 pb-4">
                            <div className="col">
                                <h6 className="text-danger">{this.state.msg}</h6>
                            </div>
                        </div>)
                    }

                    {this.state.src && (
                        <div className="row">
                            <div className="col">
                                <nav>
                                    <ul className="nav nav-tabs nav-justified">
                                        <li className="nav-item">
                                            <a className={`nav-link active ${this.checkFilled("horizontal") != -1 ? "complete" : ""}`} data-toggle="tab" href="#nav-horizontal" role="tab" aria-controls="nav-horizontal" aria-selected="true">Horizontal</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${this.checkFilled("vertical") != -1 ? "complete" : ""}`} data-toggle="tab" href="#nav-vertical" role="tab" aria-controls="nav-vertical" aria-selected="false"> Vertical</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${this.checkFilled("horizontal-small") != -1 ? "complete" : ""}`} data-toggle="tab" href="#nav-horizontal-small" role="tab" aria-controls="nav-horizontal-small" aria-selected="false">Horizontal small</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className={`nav-link ${this.checkFilled("gallery") != -1 ? "complete" : ""}`} data-toggle="tab" href="#nav-gallery" role="tab" aria-controls="nav-gallery" aria-selected="false">Gallery</a>
                                        </li>
                                    </ul>
                                </nav>

                                <div className="tab-content" id="nav-tabContent">
                                    {
                                        this.state.previews.map((data, i) => {
                                            return (<Preview updateCropedImages={this.updateCropedImages.bind(this)} key={i} name={data.name} sizes={data.sizes} active={data.name === "horizontal" ? "active" : ""} src={this.state.src}></Preview>)
                                        })
                                    }</div>
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
        // }



    }
}
)
