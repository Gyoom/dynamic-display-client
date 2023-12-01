// npm packages
import React,{ useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Layout, Card, Button } from 'antd';
import { List as MovableList, arrayMove } from 'react-movable';
// react components
import AddPageForm from "components/ConfigPage/AddPageForm/AddPageForm";
// react services
import configServices from "services/config";

const { Header, Footer, Content } = Layout;

const ConfigPage = () => {
    const navigate = useNavigate()
    const [AddPageActive, setAddPageActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [slides, setSlides] = useState([]);


    const loadData = () => {
        if (isLoading) {
          return;
        }
        setIsLoading(true);
        configServices.getAll()
          .then(response => {
            
            setSlides([...response]);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSave = () => {
        const mapOrder = []
        for (let index = 0; index < slides.length; index++) {
            slides[index].order = index
            mapOrder.push({id: slides[index].id, order:index })
        }
        configServices.updateOrder(mapOrder)
        navigate("/config");
    }

    const handleDelete = (id) => {
        var newSlides = slides.filter(slide => slide.id !== id)
        for (let index = 0; index < newSlides.length; index++) {
            newSlides[index].order = index
        }
        setSlides(newSlides)
        configServices.remove(id)
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
                        {AddPageActive ? <AddPageForm slides={slides} setSlides={setSlides} /> : ""}
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
                                        <Card style={{margin:5, width:"600px"}} title={<h4>{(value.order+ 1) + " - "+value.name}</h4>} bordered={false}>
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
                                                <Button danger onClick={() => handleDelete(value.id)} style={{ margin:5, marginRight:20, marginTop:10, float:"right"}}>Delete</Button>     
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