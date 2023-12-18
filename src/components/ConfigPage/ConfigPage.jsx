// npm package(s)
import React, { useState } from "react"
import { Layout, Button } from 'antd'
// local file(s)
import scroolToTopImage from "../../Assets/returnToTop.png"
// react component(s)
import AddSlideForm from "components/ConfigPage/AddSlideForm/AddSlideForm"
import Serie from "./Serie/Serie"
import SeriesList from "./SeriesList/SeriesList"
import SlidesList from "./SlidesList/SlidesList"
// css file(s)
import './ConfigPage.css'

const { Header, Footer, Content } = Layout;

const ConfigPage = () => {
    // use state(s)
    const [isUserHasScroll, setIsUserHasScroll] = useState(false)
    const [centralColumnDisplay, setCentralColumnDisplay] = useState('series')
    const [currentSerie, setCurrentSerie] = useState({})

    window.addEventListener("scroll", () => {
        setIsUserHasScroll(window.scrollY !== 0)
    })

    return (
        <>  
            <Layout id="layout">
                    <Header id="header">
                        <h1 style={{height:10}}>Alpha Innovations</h1>
                        <div style={{ width:"100%" }}>
                            <h3 style={{ display: "inline", paddingLeft:30 }}>Dynamic Page Display</h3>
                        </div>
                    </Header>
                    <Content  id="content">
                        <div id='leftColumn'>
                            <div style={{ position:'sticky', top:10}}>
                                <div>
                                    <Button style={{ margin:5, width:120, fontWeight:'bold' }} onClick={() => {setCentralColumnDisplay('series')}}>Series</Button>
                                </div>
                                <div>
                                    <Button style={{ margin:5, width:120, fontWeight:'bold' }} onClick={() => {setCentralColumnDisplay('slides')}}>Slides</Button>
                                </div> 
                            </div>
                        </div>
                        <div id='centralColumn'>
                            {
                                centralColumnDisplay === 'series' ?     
                                    <SeriesList 
                                        setCentralColumnDisplay={setCentralColumnDisplay}
                                        setCurrentSerie={setCurrentSerie}
                                    /> :
                                centralColumnDisplay === 'serie' ? 
                                    <Serie 
                                        serie={currentSerie}
                                    /> :
                                centralColumnDisplay === 'slides' ?     
                                    <SlidesList 
                                        setCentralColumnDisplay={setCentralColumnDisplay}
                                        setCurrentSerie={setCurrentSerie}
                                    /> : 
                                centralColumnDisplay === 'addSlide' ? 
                                    <AddSlideForm 
                                        setCentralColumnDisplay={setCentralColumnDisplay}
                                    /> :
                                ''
                            }
                            
                        </div> 
                        <div id='rightColumn'>
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