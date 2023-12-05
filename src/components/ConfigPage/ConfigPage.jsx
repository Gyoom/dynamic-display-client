// npm package(s)
import React,{ useEffect, useState, useContext } from "react"
import { useNavigate } from 'react-router-dom'
import { Layout, Card, Button, InputNumber } from 'antd'
import { List as MovableList, arrayMove } from 'react-movable'
// react component(s)
import AddPageForm from "components/ConfigPage/AddPageForm/AddPageForm"
// react service(s)
import picturesService from "services/slides"
// react context(s)
import { Context as ConfigContext } from "contexts/configContext"

const { Header, Footer, Content } = Layout;

const ConfigPage = () => {
    // use context(s)
    const { 
        isConfigInitialized, 
        config,
        changeConfig
    } = useContext(ConfigContext)
    // use navigate
    const navigate = useNavigate()
    // use state(s)
    const [isLoading, setIsLoading] = useState(false)
    const [slides, setSlides] = useState([])
    const [AddPageActive, setAddPageActive] = useState(false)
    const [displayDelay, setDisplayDelay] = useState(0)
    const [reloadDelay, setReloadDelay] = useState(0)

    // use effect(s)
    const loadData = () => {
        if (!isLoading) {
            setIsLoading(true);
            picturesService.getAll()
            .then(response => {
                
                setSlides([...response])
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
        }
        if (isConfigInitialized)
        {
            setDisplayDelay(config.displayDelay) 
            document.getElementById("displayDelayInput").style.border = ""
            setReloadDelay(config.reloadDelay)
            document.getElementById("reloadDelayInput").style.border = ""
        }
    }

    useEffect(() => {
        loadData();
    }, [isConfigInitialized]);

    //  handle(s)
    const handleSave = async () => {
        // save order slides
        const newOrder = []
        for (let index = 0; index < slides.length; index++) {
            slides[index].order = index
            newOrder.push({id: slides[index].id, order:index })
        }
        // save config
        if(
            displayDelay !== config.displayDelay ||
            reloadDelay !== config.reloadDelay
           )
        {
            var newConfig = 
            {
                displayDelay: displayDelay,
                reloadDelay: reloadDelay
            }
            await changeConfig(newConfig)

        }
        await picturesService.updateOrder(newOrder)
        navigate("/config");
    }

    const handleDelete = (order) => {
        var newSlides = slides.filter(slide => slide.order !== order)
        for (let index = 0; index < newSlides.length; index++) {
            newSlides[index].order = index
        }
        setSlides(newSlides)
        picturesService.remove(order)
        navigate("/config");
    }

    const handleReloadDelay = (e) => {
        if (!Number.isInteger(e) || e < 5)
        {   
            document.getElementById("reloadDelayInput").style.border = "2px solid red"
            return
        }
        document.getElementById("reloadDelayInput").style.border = ""
        console.log(e)
        setReloadDelay(e)
    }

    const handleDisplayDelay = (e) => {
        if (!Number.isInteger(e) || e < 1)
        {   
            document.getElementById("displayDelayInput").style.border = "2px solid red"
            return
        }
        document.getElementById("displayDelayInput").style.border = ""
        setDisplayDelay(e)

    }

    return (
        <>  
            <Layout id="layout">
                    <Header id="header">
                        <h1 style={{height:10}}>Alpha Innovations</h1>
                        <div style={{ width:"100%" }}>
                            <h3 style={{ display: "inline", paddingLeft:30 }}>Dynamic Page Display - Config</h3>
                            <InputNumber 
                                    style={{ marginTop:30, marginLeft:5, float:"right" }}
                                    size="small" 
                                    addonAfter="min"
                                    id="reloadDelayInput"
                                    value={reloadDelay}
                                    onChange={handleReloadDelay}
                                    
                                />
                            <label style={{ marginTop:10, marginLeft:15, float:"right" }}>
                                Reload Delay ({'>='} 5) : 
                            </label>
                            <InputNumber 
                                    style={{ marginTop:30, marginLeft:5, float:"right" }}
                                    size="small" 
                                    addonAfter="s"
                                    id="displayDelayInput"
                                    value={displayDelay}
                                    onChange={handleDisplayDelay}
                            />
                            <label style={{ marginTop:10, float:"right" }}>
                                Display Delay ({'>='} 1) :   
                            </label>
                        </div>
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
                                                    value.domainId === "" ?
                                                    <label>Uploded Image</label> :
                                                    <>
                                                    <label>Automatic screenshot capture</label>
                                                    <p style={{color:"red", margin:0, paddingLeft:20}}>* to modify this slide please contact a web developer</p>
                                                    </>
                                                }
                                            </div>
                                            <div> 
                                                <Button danger onClick={() => handleDelete(value.order)} style={{ margin:5, marginRight:20, marginTop:10, float:"right"}}>Delete</Button>     
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
                                <Button style={{ margin:5}} onClick={() => setAddPageActive(!AddPageActive)}>Add Page</Button>
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