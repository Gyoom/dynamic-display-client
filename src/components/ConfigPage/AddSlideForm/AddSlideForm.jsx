// packages npm
import React,{ useContext, useState, useEffect } from "react"
import { Button, Form, Input, Card, Select } from 'antd'
import { v4 as uuid } from 'uuid'
// react context(s)
import { Context as ConfigContext } from "contexts/configContext"
import { Context as SlideContext } from "contexts/slidesContext"

const AddPageForm = ({ setCentralColumnDisplay }) => {
    // use Context(s)
    const {isConfigInitialized, config } = useContext(ConfigContext)
    const { slides, addSlide } = useContext(SlideContext)
    // use state(s)
    const [image, setImage] = useState("")
    const [isSlideNewNameError, setIsSlideNewNameError] = useState(true)
    const [isScreenshotSlide, setIsScreenshotSlide] = useState(false)
    const [uploadErrorMessage, setUploadErrorMessage] = useState("* No files currently selected for upload")
    const [domains, setDomains] = useState([])
    const [domain, setDomain] = useState(undefined)
    var checkForm = !isSlideNewNameError && (isScreenshotSlide ? domain !== undefined : image !== '')
    
    // use effect(s)
    const loadData = () => {
        if (isConfigInitialized) {
            var newDomains = []
            config.domains.forEach(domain => {
                var newDomain = {
                    value:  domain.name,
                    label: domain.name
                }
                newDomains.push(newDomain)
            })
            setDomains(newDomains) 
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    // fonctions
    const fileTypes = [
        "image/jpeg",
        "image/png",
    ]

    function validFileType(file) {
        return fileTypes.includes(file.type);
    }

    // handle(s)
    const handleErrorSubmit = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    const handleSubmit = async (values) => {
        var newSlide = {}
        if (isScreenshotSlide)
        {
            newSlide = {
                id: uuid(),
                name: values.name,
                picture: '',
                domain: values.domain,
                webpagePathData: values.webpagePathData
            }
        } else {
            if (image === '') {
                setUploadErrorMessage("* No files currently selected for upload")
                return
            }
            newSlide = {
                id: uuid(),
                name: values.name,
                picture: image,
                domain: '',
                webpagePathData: ''
            }
        }

        try {
            await addSlide(newSlide)
            setCentralColumnDisplay('slides') 
        } catch (err) {
            console.log(err)
            alert('communication error with the server, please contact a developer')
        }
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

        setUploadErrorMessage("")
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
            setImage(reader.result)
        }
    }

    const handleChangeName = (e) => {
        setIsSlideNewNameError(false)
        document.getElementById("newSlideNameInput").style.border = ""
        for (let index = 0; index < slides.length; index++) {
            if (slides[index].name === e.target.value)
            {
                document.getElementById("newSlideNameInput").style.border = "2px solid red"
                setIsSlideNewNameError(true)
            } else if (e.target.value === '') 
                setIsSlideNewNameError(true)
        }
    }

    return (
        <div>
            <ul>
                
                <Card style={{margin:5, width:"600px", backgroundColor:'#1e2842', marginLeft:'auto', marginRight:'auto',  color:'#fff' }} title={<h3 style={{ color:'#fff' }}>New Slide</h3>} >
                    <Form

                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        onFinish={handleSubmit}
                        onFinishFailed={handleErrorSubmit}
                        autoComplete="off"
                    >
                        <label style={{ display:'block', fontSize:10, fontWeight:'bold',  color:'#fff'}}>Name : </label>
                        <Form.Item
                            name="newSlideName"
                            style={{
                                width: 450,
                                marginBottom:5,
                            }}
                            rules={[{ required: true, message: 'Please input a name ...' }]}
                        >
                            <Input id='newSlideNameInput' placeholder="New slide name ..." onChange={handleChangeName}/>
                        </Form.Item>
                        <Form.Item style={{marginBottom:5}}>
                            <label style={{display:"block"}}>
                                <input style={{ verticalAlign: "middle", position: "relative", bottom:"1px" }} type="checkbox" id="screenshotCheckbox" onClick={(e) => setIsScreenshotSlide(e.target.checked)}/>
                                <span style={{ color:'#fff' }}> Is this an automatic screenshot ?</span>
                            </label>
                        </Form.Item>
                        { isScreenshotSlide ? 
                            // screenshot form
                            <>
                                <label style={{ display:'block', fontSize:10, fontWeight:'bold', color:'#fff' }}>Website : </label>
                                <Form.Item
                                    name="domain"
                                    style={{
                                        width: 450,
                                        marginBottom:20
                                    }}
                                    rules={[{ required: true, message: 'Please input a domain name ...' }]}
                                >
                                    <Select
                                        allowClear
                                        onChange={(e) => setDomain(e)}
                                        options={domains}
                                    />
                                </Form.Item>
                                {
                                    domain === 'AIGrafana' ?
                                    <>
                                        <label style={{ display:'block', fontSize:10, fontWeight:'bold', color:'#fff' }}>WebPage URL : </label>
                                        <Form.Item
                                            name="webpagePathData"
                                            style={{
                                                width: 450,
                                                marginBottom:20
                                            }}
                                            rules={[{ required: true, message: 'Please input a url ...' }]}
                                        >
                                            <Input /> 
                                        </Form.Item> 
                                    </> :
                                    domain === 'AIMyReport' ?
                                    <>
                                        <label style={{ display:'block', fontSize:10, fontWeight:'bold', color:'#fff' }}>Tab name : </label>
                                        <Form.Item
                                            name="webpagePathData"
                                            style={{
                                                width: 450,
                                                marginBottom:20
                                            }}
                                            rules={[{ required: true, message: 'Please input a tab ...' }]}
                                        >
                                            <Input /> 
                                        </Form.Item> 
                                    </> :
                                    ''
                                    
                                }
                            </>
                        : 
                            // local picture form
                            <Form.Item
                                style={{
                                    width: 450,
                                    marginBottom:5
                                }}
                            >  
                                <div style={{ width:600 }}>
                                    <label className="label_add_slide" id="label_image_uploads" htmlFor="image_uploads">Choose a image .png, .jpg, .jpeg ...</label> 
                                    <input type="file" style={{ opacity:"0" }} id="image_uploads" name="image_uploads" accept="image/png, image/jpeg" onChange={handleImageChange}/>
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
                            { 
                                checkForm ? 
                                    <Button style={{ marginLeft:20, color:'#fff' }} type="primary" htmlType="submit">Add</Button> 
                                : 
                                    <Button style={{ marginLeft:20, color:'#fff' }} disabled type="primary" htmlType="submit">Add</Button>
                            }
                            
                        </Form.Item>

                    </Form>
                </Card>
            </ul>
        </div>  
    )
}

export default AddPageForm