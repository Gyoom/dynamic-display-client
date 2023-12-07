// npm package(s)
import React,{ useEffect, useState, useContext } from "react"
import { useNavigate } from 'react-router-dom'
import { Layout, Card, Button } from 'antd'
import { List as MovableList, arrayMove } from 'react-movable'
// react component(s)
import AddPageForm from "components/ConfigPage/AddPageForm/AddPageForm"
import UpdateConfigForm from "./UpdateConfigForm/UpdateConfigForm"
// react service(s)
import slideServices from "services/slides"
// react context(s)
import { Context as ConfigContext } from "contexts/configContext"


const { Header, Footer, Content } = Layout;

const ConfigPage = () => {
    // use navigate
    const navigate = useNavigate()
    // use state(s)
    const [isLoading, setIsLoading] = useState(false)
    const [slides, setSlides] = useState([])
    const [addSlideActive, setAddSlideActive] = useState(false)
    const [updateConfigActive, setUpdateConfigActive] = useState(false)
    // config use state(s)
    const [displayDelay, setDisplayDelay] = useState(-1)
    const [reloadDelay, setReloadDelay] = useState(-1)
    const [transitionDelay, setTransitionDelay] = useState(-1)
    const [domainNames, setDomainNames] = useState([])
    const { 
        config,
        changeConfig
    } = useContext(ConfigContext)

    // use effect(s)
    const loadData = () => {
        if (!isLoading) {
            setIsLoading(true);
            slideServices.getAll()
            .then(response => {
                
                setSlides([...response])
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    //  handle(s)
    const handleSave = async () => {
        // save order slides
        const newOrder = []
        for (let index = 0; index < slides.length; index++) {
            slides[index].order = index
            newOrder.push({id: slides[index].id, order:index })
        }
        await slideServices.updateOrder(newOrder)

        if(
            displayDelay !== config.displayDelay ||
            reloadDelay !== config.reloadDelay ||
            transitionDelay !== config.transitionDelay ||
            domainNames.toString() !== config.domains.toString()
           )
        {
            var newConfig = 
            {
                displayDelay: displayDelay,
                reloadDelay: reloadDelay,
                transitionDelay : transitionDelay,
                domains : domainNames
            }
            await changeConfig(newConfig)  
            setUpdateConfigActive(false)
        } 
    }

    const handleDelete = (order) => {
        var newSlides = slides.filter(slide => slide.order !== order)
        for (let index = 0; index < newSlides.length; index++) {
            newSlides[index].order = index
        }
        setSlides(newSlides)
        slideServices.removeOneById(order)
        navigate("/config");
    }

    const displayForm = (form, value) => {
        setAddSlideActive(false)
        setUpdateConfigActive(false)
        switch(form) {
            case 'config':
                setUpdateConfigActive(value)
                break
            case 'slide':
                setAddSlideActive(value)
                break
            default:
                break

        }
        window.scrollTo(0, 0)
    }

    return (
        <>  
            <Layout id="layout">
                    <Header id="header">
                        <h1 style={{height:10}}>Alpha Innovations</h1>
                        <div style={{ width:"100%" }}>
                            <h3 style={{ display: "inline", paddingLeft:30 }}>Dynamic Page Display - Config</h3>
                        </div>
                    </Header>
                    <Content  id="content">
                        {addSlideActive ? <AddPageForm 
                            slides={slides} 
                            setSlides={setSlides} 
                            setAddSlideActive={setAddSlideActive}
                        /> : ""}
                        {updateConfigActive ? <UpdateConfigForm 
                            displayDelay={displayDelay} 
                            setDisplayDelay={setDisplayDelay}
                            reloadDelay={reloadDelay}
                            setReloadDelay={setReloadDelay}
                            transitionDelay={transitionDelay}
                            setTransitionDelay={setTransitionDelay}
                            domainNames={domainNames}
                            setDomainNames={setDomainNames}
                        /> : ""}
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
                                            { 
                                            value.domain === "" ?
                                                <>
                                                    <div style={{margin:10}}>
                                                        <label style={{fontWeight:"bold"}}>Image Origin : </label>
                                                        <label>local uploded image</label>
                                                    </div>
                                                </> 
                                                :
                                                <>
                                                    <div style={{margin:10}}>
                                                        <label style={{fontWeight:"bold"}}>Image Origin : </label>
                                                        <label>Automatic screenshot capture</label>
                                                    </div>
                                                    <div style={{margin:10}}>
                                                        <label style={{fontWeight:"bold"}}>Domain : </label>
                                                        <label>{ value.domain}</label>
                                                    </div>
                                                    <div style={{margin:10}}>
                                                        <label style={{fontWeight:"bold"}}>WebPagePath : </label>
                                                        <label>{ value.webpagePathData }</label>
                                                    </div>
                                                </>
                                            }
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
                                <Button type="primary" style={{ margin:5, width:120 }} onClick={() => handleSave()}>Save Changes</Button>
                            </div>
                            <div>
                                <Button style={{ margin:5, width:120 }} onClick={() => displayForm('slide', !addSlideActive)}>Add Page</Button>
                            </div>
                            <div>
                                <Button style={{ margin:5, width:120 }} onClick={() => displayForm('config', !updateConfigActive)}>Update Config</Button>
                            </div>
                        </div>
                        <div id="rightButtonConfig" >
                            <div>
                                <Button type="primary" style={{ margin:5, width:150 }} onClick={() => navigate("/")}>Return to Slideshow</Button>
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