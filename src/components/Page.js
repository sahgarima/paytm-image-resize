import React, { useState } from 'react';
import storage from "../firebase"
import { withRouter } from "react-router-dom";
import Loader from 'react-loader-spinner'

export default withRouter(class Page extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            images: [],
            downloadURLs: {},
            loading:true
        }
        this.getImage = this.getImage.bind(this)
        this.handleBack = this.handleBack.bind(this)
    }
    componentDidMount() {
        this.getImage()
    }

    getImage() {
        const this1 = this
        let { state } = this
        const name = localStorage.getItem('imageName');
        storage.ref().child(`Cropped/${name}`).listAll().then(function (res) {
            let arr = [];
            res.items.forEach(function (itemRef) {
                itemRef
                    .getDownloadURL()
                    .then(url => {
                        let downloadURLs = {};
                        downloadURLs["url"] = url;
                        downloadURLs["name"] = (itemRef.name).replace(".jpeg",'')
                        arr.push(downloadURLs)
                        this1.setState({ images: arr,loading:false });
                    })
                    .catch(error => {
                        // Handle any errors
                    });
            });

        })
            .catch(function (error) {
                // Uh-oh, an error occurred!
            });
    }
    handleBack(){
        this.props.history.push('/')
    }
    render() {
        return (
            <>
            {this.state.loading &&
                    <div className="popup"><Loader type="Circles" color="#00BFFF" height={80} width={80} /></div>
                }
            
            <div className="container border mt-5">
                <div className="row m-3">
                    <div className="col text-left">
                        <button className="btn btn-success" onClick={this.handleBack}>Go To Home</button>
                    </div>

                </div>
                {
                    this.state.images.map((data, id) => {
                        return (
                            <div key={id} className="row pb-5">
                                <div className="col">
                                <h2>{(data.name).toUpperCase()}</h2>
                                <p>This is {data.name} Image:</p>
                                <img src={data.url} alt={data.name} className="img-responsive rounded" />
                            </div></div>)
                    })
                }


            </div>

</>

        );
    }
})