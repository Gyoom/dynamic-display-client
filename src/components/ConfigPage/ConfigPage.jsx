// npm package(s)
import React,{ useEffect, useState, useContext } from "react"
import { useNavigate } from 'react-router-dom'
import { Layout, Card, Button } from 'antd'
import { List as MovableList, arrayMove } from 'react-movable'
// local file(s)
import scroolToTopImage from "../../Assets/returnToTop.png"
// react component(s)
import AddPageForm from "components/ConfigPage/AddPageForm/AddPageForm"
import UpdateConfigForm from "./UpdateConfigForm/UpdateConfigForm"
// react service(s)
import slideServices from "services/slides"
// react context(s)
import { Context as ConfigContext } from "contexts/configContext"
// css file(s)
import './ConfigPage.css'

const { Header, Footer, Content } = Layout;

const ConfigPage = () => {
    // use navigate
    const navigate = useNavigate()
    // use state(s)
    const [isUserHasScroll, setIsUserHasScroll] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [slides, setSlides] = useState([])
    const [addSlideActive, setAddSlideActive] = useState(false)
    const [updateConfigActive, setUpdateConfigActive] = useState(false)
    
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
        loadData()
    }, [])

    window.addEventListener("scroll", () => {
        setIsUserHasScroll(window.scrollY !== 0)
    })

    //  handle(s)
    const handleSave = async () => {
        // save order slides
        const newOrder = []
        for (let index = 0; index < slides.length; index++) {
            slides[index].order = index
            newOrder.push({id: slides[index].id, order:index })
        }
        await slideServices.updateOrder(newOrder)
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
                        <div id='leftColumn'>
                            <div style={{ position:'sticky', top:10}}>
                                <div>
                                    <Button style={{ margin:5, width:120 }} onClick={() => {}}>All Slides</Button>
                                </div>
                                <div>
                                    <Button style={{ margin:5, width:120 }} onClick={() => displayForm('slide', !addSlideActive)}>Add Slide</Button>
                                </div>
                                <div>
                                    <Button style={{ margin:5, width:120 }} onClick={() => {}}>Series</Button>
                                </div>
                                <div>
                                    <Button style={{ margin:5, width:120 }} onClick={() => displayForm('config', !updateConfigActive)}>Config</Button>
                                </div>   
                            </div>
                        </div>
                        <div id='centralColumn'>
                            {
                                addSlideActive ? 
                                <AddPageForm 
                                    slides={slides} 
                                    setSlides={setSlides} 
                                    setAddSlideActive={setAddSlideActive}
                                /> :
                                updateConfigActive ? <UpdateConfigForm/> : 
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
                            }
                            
                        </div> 
                        <div id='rightColumn'>
                            <div style={{ position:'sticky', top:10}}> 
                                <Button type="primary" style={{ margin:5, width:150 }} onClick={() => navigate("/")}>Return to Slideshow</Button>  
                            </div>
                            { isUserHasScroll ? 
                                <div style={{ position:'fixed', right:10, bottom:50}}>
                                    <img onClick={() => window.scrollTo(0, 0)} src={scroolToTopImage} style={{height:'3em', width:'3em'}}></img>
                                </div> 
                            : '' }
                        </div>
                    </Content>
                    <Footer id="footer">
                        
                    </Footer>
            </Layout>
        </>
    );
}

export default ConfigPage