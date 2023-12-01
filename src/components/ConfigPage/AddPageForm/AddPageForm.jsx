// packages npm
import React,{ useState } from "react";
import { Button, Form, Input, Card } from 'antd';
import { v4 as uuid } from 'uuid';
// react services
import configServices from "services/config";

const AddPageForm = ({ slides, setSlides }) => {
    const [image, setImage] = useState("");
    const [uploadErrorMessage, setUploadErrorMessage] = useState("No files currently selected for upload");

    const fileTypes = [
        "image/jpeg",
        "image/png",
    ];



    const handleSubmit = async (values) => {
        if (image === "")
        {
            setUploadErrorMessage("No files currently selected for upload")
            return
        }

        var newSlide = {
            id: uuid(),
            order: slides.length,
            name: values.name,
            group: values.group ? values.group : "",
            picture: image,
            domainId: -1,
            domainOrder: -1
        }

        setSlides(slides.concat(newSlide))
        configServices.post(newSlide)
        location.replace(location.href);
        
        
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
            setUploadErrorMessage("No files currently selected for upload")
            setImage("")
            return
        }
        if (!validFileType(e.target.files[0])) {
            setUploadErrorMessage("the current file type is incorrect")
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

                        <Form.Item
                            className="label_add_slide"
                            label="Group : "
                            name="group"
                            placeholder="my product ..."
                            rules={[{ required: false }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>  
                        <div style={{width:"500px"}}>
                            <label className="label_add_slide" id="label_image_uploads" htmlFor="image_uploads">Choose image (.png, .jpg, .jpeg)</label> 
                            <input type="file" style={{ opacity:"0"}}id="image_uploads" name="image_uploads" accept="image/png, image/jpeg" onChange={handleImageChange}/>
                        </div>
                        <div id="preview" style={{ marginTop:"20px" }}>
                            { image !== "" ? <img id="img"  src={image} height="100px"/>: "" }
                            { uploadErrorMessage ? <p style={{color:"red"}}>{uploadErrorMessage}</p> : "" }
                            
                        </div>
                        </Form.Item>

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


