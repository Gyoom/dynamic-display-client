// npm package(s)
import React,{ useState, useContext, useEffect } from "react"
import { Button, List, } from 'antd'
import VirtualList from 'rc-virtual-list'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
// react context(s)
import { Context as SlidesContext } from "contexts/slidesContext"


const SlidesList = ({ setCentralColumnDisplay, setCurrentSerie }) => {
    // use Context(s)
    const { slides, removeSlide } = useContext(SlidesContext)
    // use State(s)

    const handleAddSlide = () => {
        setCentralColumnDisplay('addSlide')
    }
    
    return (
        <>
            <List
                size="small"
                style= {{ border: '1px solid', width:'75%', marginLeft:'auto', marginRight:'auto', backgroundColor:'#1e2842', color:'#fff' }}
                bordered
                header=
                    {   
                        <div style={{  width:'100%', display: 'flex', flexDirection:'row' }}>
                            <div style={{  margin:'auto', fontWeight:'bold' }}>
                                Slides
                            </div>
                            <div style={{ width:'100%', textAlign:'right' }}>
                                <Button type="text" style={{ marginLeft:10, color:'#fff' }} icon={<PlusOutlined />} onClick={handleAddSlide}></Button>
                            </div>
                        </div>    
                    }
            >
                <VirtualList
                    data={slides}
                    height=
                    {
                        slides.length * 50 < window.screen.height / 2.1 ? slides.length * 50  : window.screen.height / 2.1
                    }
                    itemHeight={slides.length}
                    itemKey="id"   
                >
                    {(slide) => (
                        <List.Item style= {{ borderTop: '1px solid' }}>
                            <List.Item.Meta
                                title={slide.name}
                            /> 
                            <Button type="text" icon={<MinusOutlined />} style={{ marginLeft:2, marginRight:2, color:'#fff' }} onClick={() => removeSlide(slide.id)}>
                            </Button>
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </>
    )
}

export default SlidesList