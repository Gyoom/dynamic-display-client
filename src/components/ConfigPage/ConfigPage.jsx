import React,{ useEffect, useState } from "react";
import { useNavigate, redirect } from 'react-router-dom'
import { Layout, Card, Button } from 'antd';
import { List as MovableList, arrayMove } from 'react-movable';
// react components
import AddPageForm from "components/AddPageForm/AddPageForm";
// react services
import configServices from "services/config";

const { Header, Footer, Content } = Layout;

const ConfigPage = () => {

    const navigate = useNavigate()
    const [AddPageActive, setAddPageActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [slides, setSlides] = useState([]);


    const loadMoreData = () => {
        if (loading) {
          return;
        }
        setLoading(true);
        configServices.getAll()
          .then(response => {
            setSlides([...response]);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
    };

    useEffect(() => {
    loadMoreData();
    }, []);

    const handleSave = () => {
        for (let index = 0; index < slides.length; index++) {
            slides[index].id = index
        }
        configServices.post(slides)
        navigate("/config");
    }

    const handleDelete = (id) => {
        var newSlides = slides.filter(slide => slide.id !== id)
        for (let index = 0; index < newSlides.length; index++) {
            newSlides[index].id = index
        }
        setSlides(newSlides)
        configServices.post(newSlides)
        navigate("/config");
    }

    return (
        <>  
            <Layout id="layout">
                    <Header id="header">
                        <h1 style={{height:10}}>Alpha Innovations</h1>
                        <h3 style={{paddingLeft:30}}>Dynamic Page Display - Config</h3>
                    </Header>
                    <Content  id="content">
                        {AddPageActive ? <AddPageForm slides={slides} setSlides={setSlides}/> : ""}
                        <div id="configList">
                            <MovableList
                                values={slides}
                                onChange={({ oldIndex, newIndex }) => {
                                        setSlides(arrayMove(slides, oldIndex, newIndex)) 
                                    }
                                
                                }
                                renderList={({ children, props }) => <ul {...props}>{children}</ul>}
                                renderItem={({ value, props }) => (
                                    <div {...props} >
                                        <Card style={{margin:5, width:"600px"}} title={<h4>{value.id + " - "+value.name}</h4>} bordered={false}>
                                            <div style={{margin:10}}>
                                                <label style={{fontWeight:"bold"}}>Image group : </label>
                                                <label>
                                                    {
                                                        value.group === "" ?
                                                        "No group" :
                                                        value.group
                                                    }
                                                </label>
                                            </div>
                                            <div style={{margin:10}}>
                                                <label style={{fontWeight:"bold"}}>Image type : </label>
                                                {
                                                    value.domainId === -1 ?
                                                    <label>Uploded Image</label> :
                                                    <>
                                                    <label>Automatic screenshot capture</label>
                                                    <p style={{color:"red", margin:0, paddingLeft:20}}>* to modify this slide please contact a web developer</p>
                                                    </>
                                                }
                                            </div>
                                            <div>
                                                {   
                                                    value.domainId === -1 ?
                                                    <Button danger onClick={() => handleDelete(value.id)} style={{ margin:5, marginRight:20, marginTop:10, float:"right"}}>Delete</Button> : 
                                                    <Button danger disabled style={{ margin:5, marginRight:20, marginTop:10, float:"right"}}>Delete</Button> 
                                                }
                                            </div>
                                
                                            {value.dommainId !== -1 }

                                        </Card>
                                    </div>
                                )}
                            />
                            
                        </div>  
                        <div id="leftButtonConfig" >
                            <div>
                                <Button type="primary" style={{ margin:5}} onClick={() => handleSave()}>Save Changes</Button>
                            </div>
                            <div>
                                <Button style={{ margin:5}} onClick={() => setAddPageActive(true)}>Add Page</Button>
                            </div>
                        </div>
                        <div id="rightButtonConfig" >
                            <div>
                                <Button type="primary" style={{ margin:5}} onClick={() => navigate("/")}>Return to Slideshow</Button>
                            </div>
                        </div>
                    </Content>
                    <Footer id="footer">
                        
                    </Footer>
            </Layout>
        </>
    );
}

export default ConfigPage