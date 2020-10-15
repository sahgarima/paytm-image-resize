import React, { useState } from 'react';
import 'react-image-crop/lib/ReactCrop.scss';
import ReactCrop from 'react-image-crop';

export default function Preview(props) {
    // let croppedImageUrl = "";
    let [croppedImageUrl, setCroppedImageUrl] = useState({})
    let [crop, setCrop] = useState({
        x: props.sizes.width,
        y: props.sizes.height,
        aspect: 3 / 2,
    })
    let [imageRef, setImageRef] = useState("")


    const onImageLoaded = image => {
        // console.log("in onImageLoaded")
        setImageRef(image)
        // this.imageRef = image;
        setCrop({ unit: 'px', maxWidth: props.sizes.width, maxHeight: props.sizes.height });
        // this.setState({
        //     crop: makeAspectCrop({
        //         x: 0,
        //         y: 0,
        //         aspect: crop.aspect,
        //         width: 100,
        //     }, image.naturalWidth / image.naturalHeight),
        //     image,
        // });
        return false;
    };
    const onCropComplete = (crop, percentCrop) => {
        // console.log('onCropComplete', crop, percentCrop);
        makeClientCrop(crop);
    };

    function makeClientCrop(crop) {
        // console.log("makeClientCrop-----", imageRef, crop.width, crop.height)
        if (imageRef && crop.width && crop.height) {
            // console.log(imageRef)
            getCroppedImg(imageRef, crop, `${props.name}.jpeg`).then(croppedImageUrl => {
                //    let obj={}
                //    obj["id"] = Math.random();
                //     obj["name"] = croppedImageUrl;
                //     obj["type"] = "image/jpeg";
                //     obj["size"]= ""
                setCroppedImageUrl(croppedImageUrl)
                props.updateCropedImages(props.name, croppedImageUrl)
            }

                // this.setState({ croppedImageUrl })
            );
        }
    }
    function getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise(resolve => {
            canvas.toBlob(blob => {
                // console.log(blob, "blob")
                let fileUrl = ""
                blob.fileName = fileName
                window.URL.revokeObjectURL(fileUrl);
                fileUrl = window.URL.createObjectURL(blob);

                blob.name = fileUrl //fileName; // eslint-disable-line no-param-reassign
                resolve(blob);
            }, 'image/jpeg');
        });
    }
    const onCropChange = (crop, percentCrop) => {
        // console.log('onCropChange', crop, percentCrop);
        setCrop(percentCrop)
        // this.setState({ crop: percentCrop });
    };
    const onDragStart = () => {
        // console.log('onDragStart');
    };

    const onDragEnd = () => {
        // console.log('onDragEnd');
    };
    return (
        <div className={`tab-pane fade show ${props.active}`} id={`nav-${props.name}`} role="tabpanel" aria-labelledby={`nav-${props.name}-tab`}>

            <div className="row">
                {
                    croppedImageUrl && <div className="col pt-5 pb-3">
                        <div className="text-center">
                            <img src={croppedImageUrl.name} />
                        </div>
                    </div>
                }

            </div>
            <div className="row ">
                <div className="col">
                    <div style={{ overflow: "scroll", maxHeight: "1024px", maxWidth: "1024px" }}>
                        <ReactCrop
                            src={props.src}
                            crop={crop}
                            ruleOfThirds
                            onImageLoaded={onImageLoaded}
                            onComplete={onCropComplete}
                            onChange={onCropChange}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            maxWidth={props.sizes.width}
                            maxHeight={props.sizes.height}
                            minWidth={props.sizes.width}
                            minHeight={props.sizes.height}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}