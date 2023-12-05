// packages npm
import React,{ useState } from "react";
import { Button, Form, Input, InputNumber, Card } from 'antd';
import { v4 as uuid } from 'uuid';
// react services
import picturesService from "services/slides";

const AddPageForm = ({ slides, setSlides }) => {
    // use states
    const [image, setImage] = useState("")
    const [isScreenshotSlide, setIsScreenshotSlide] = useState(false)
    const [uploadErrorMessage, setUploadErrorMessage] = useState("* No files currently selected for upload")

    const fileTypes = [
        "image/jpeg",
        "image/png",
    ];



    const handleSubmit = async (values) => {
        if (image === "" && !isScreenshotSlide)
        {
            setUploadErrorMessage("* No files currently selected for upload")
            return
        }
        console.log(values)

        var newSlide = {
            id: uuid(),
            order: slides.length,
            name: values.name,
            picture: image,
            domain: values.domain !== undefined ? values.domain : "",
            webpagePathData: values.webpagePathData !== undefined ? values.webpagePathData : -1
        }

        setSlides(slides.concat(newSlide))
        picturesService.post(newSlide)
        location.replace(location.href)   
    }

    const handleErrorSubmit = (errorInfo) => {
      console.log('Failed:', errorInfo);
    }

    function validFileType(file) {
        return fileTypes.includes(file.type);
    }

    const handleImageChange = (e) => {
        if (e.target.files.length === 0)
        {
            setUploadErrorMessage("* No files currently selected for upload")
            setImage("")
            return
        }
        if (!validFileType(e.target.files[0])) {
            setUploadErrorMessage("* The current file type is incorrect")
            setImage("")
            return
        }

        if (e.target.files[0].size >= 1048576)
        {
            setUploadErrorMessage("* This file is too large")
            setImage("")
            return
        }

        setUploadErrorMessage("")
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
            setImage(reader.result)
        }
    }

    return (
        <div id="configList">
            <ul>
                
                <Card style={{margin:5, width:"600px", backgroundColor:'#7dbcea'}} title={<h3>New Page</h3>} >
                    <Form

                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        onFinish={handleSubmit}
                        onFinishFailed={handleErrorSubmit}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Name : "
                            name="name"
                            placeholder="my product ..."
                            rules={[{ required: true, message: 'Please input a name ...' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item style={{marginBottom:5}}>
                            <label style={{display:"block"}}>
                                <input style={{ verticalAlign: "middle", position: "relative", bottom:"1px" }} type="checkbox" id="screenshotCheckbox" onClick={(e) => setIsScreenshotSlide(e.target.checked)}/>
                                Is this an automatic screenshot ?
                            </label>
                        </Form.Item>
                        { isScreenshotSlide ? 
                            <>
                                <p style={{color:"red", marginTop:0}}>* For web developers only</p>
                                <Form.Item
                                    label="Domain : "
                                    name="domain"
                                    rules={[{ required: true, message: 'Please input a domain name ...' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Path data : "
                                    name="webpagePathData"
                                    rules={[{ required: true, message: 'Please input a domain order ...' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </>
                        
                        : 
                            <Form.Item style={{marginBottom:0}}>  
                                <div style={{width:"600px"}}>
                                    <label className="label_add_slide" id="label_image_uploads" htmlFor="image_uploads">Choose a image (1 Mb max) .png, .jpg, .jpeg ...</label> 
                                    <input type="file" style={{ opacity:"0"}}id="image_uploads" name="image_uploads" accept="image/png, image/jpeg" onChange={handleImageChange}/>
                                </div>
                                <div id="preview" style={{ marginTop:"20px" }}>
                                    { image !== "" ? <img id="img"  src={image} height="100px"/>: "" }
                                    { uploadErrorMessage ? <p style={{color:"red"}}>{uploadErrorMessage}</p> : "" }
                                    
                                </div>
                            </Form.Item>
                        }

                        <Form.Item
                            style={{ marginBottom:0 }}
                        >
                            <Button style={{ marginLeft:20}} type="primary" htmlType="submit">
                                Add
                            </Button>
                        </Form.Item>

                    </Form>
                </Card>
            </ul>
        </div>  
    )
}

export default AddPageForm