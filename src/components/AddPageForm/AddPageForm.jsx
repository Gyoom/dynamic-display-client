import React,{ useEffect, useState } from "react";
import { Button, Form, Input, Upload, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import config from "services/config";

const AddPageForm = ({ slides, setSlides }) => {
    const [image, setImage] = useState(null);
    const [uploadErrorMessage, setUploadErrorMessage] = useState("");

    const configList = {
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
    }

    const handleSubmit = (values) => {
        if(image === null)
        {
            setUploadErrorMessage("Please input a image file...")
            return
        }   
        if (!(image.type === "image/jpeg" || 
            image.type === "image/png"))
        {
            setUploadErrorMessage("Incorrect image file extension...")
            return;
        }
        var newSlide = {
            id: slides.length,
            name: values.name,
            group: values.group,
            picture: image.thumbUrl,
            domainId: -1,
            domainOrder: -1
        }

        setSlides(slides.concat(newSlide))

        
        
    }

    const handleErrorSubmit = (errorInfo) => {
      console.log('Failed:', errorInfo);
    }

    const props = {
        beforeUpload: (file) => {
            return false
        },
        onChange: (info) => {
            if(info.fileList.length > 0)
                setImage(info.fileList[0])
            else 
                setImage(null)
        },
        
        listType:"picture",
        maxCount:1,
    };

    return (
        <div style={configList}>
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
                            label="Group : "
                            name="Group"
                            placeholder="my product ..."
                            rules={[{ required: true, message: 'Please input a group ...' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item 
                            label="Upload" 
                            valuePropName="file"
                        >
                            <Upload {...props}>
                                <Button icon={<UploadOutlined />}>Click to add file (.png, .jpg, .jpeg)</Button>
                            </Upload>
                            {uploadErrorMessage ? <p style={{color:"red"}}>{uploadErrorMessage}</p> : ""}
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