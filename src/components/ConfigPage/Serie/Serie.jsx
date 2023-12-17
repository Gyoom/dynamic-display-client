// npm package(s)
import React,{ useEffect, useState, useContext } from "react"
import { Card, Button, Form, InputNumber, Input, Select } from 'antd'
import { List as MovableList, arrayMove } from 'react-movable'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { v4 as uuid } from 'uuid'
// react context(s)
import { Context as SeriesContext } from "contexts/seriesContext"
import { Context as SlidesContext } from "contexts/slidesContext"

const Serie = ({ serie }) => {
    // use context(s)
    const { series, addSerieSlide, removeSerieSlide, updateSlidesOrder, updateParams } = useContext(SeriesContext)
    const { slides, isSlidesInitialized } = useContext(SlidesContext)
    // use state(s)
    const [isLoading, setIsLoading] = useState(false)
    const [isValueChanged, setIsValueChanged] = useState(false)
        // param values
    const [displayDelay, setDisplayDelay] = useState(-1)
    const [reloadDelay, setReloadDelay] = useState(-1)
    const [transitionDelay, setTransitionDelay] = useState(-1)
    const [name, setName] = useState('')
        // locale lists
    const [localSlides, setLocalSlides] = useState([])
    const [selectSlides, setSelectSlides] = useState([])

    // use effect(s)
    const loadData = async () => {
        if (!isLoading) {
            setIsLoading(true)
            // input load
            setDisplayDelay(serie.displayDelay) 
            document.getElementById("displayDelayInput").style.border = ""
            setReloadDelay(serie.reloadDelay)
            document.getElementById("reloadDelayInput").style.border = ""
            setTransitionDelay(serie.transitionDelay)
            setName(serie.name)
            // serie slides load
            if (isSlidesInitialized)
            {
                var newOrder = []
                for (let i = 0; i < serie.slides.length; i++) {
                    for (let y = 0; y < serie.slides.length; y++) {
                        if (serie.slides[i].order === y)
                        {   
                            newOrder.push(serie.slides[y])
                            break
                        }
                    }  
                }
                var newSerieSlides = []
                for (let i = 0; i < newOrder.length; i++) {
                    var tempSlide = slides.find(s => s.id === newOrder[i].slideId) 
                    var newSerieSlide = {
                        id: tempSlide.id,
                        serieSlideId: newOrder[i].id,
                        name: tempSlide.name,
                        webpagePathData: tempSlide.webpagePathData,
                        domain: tempSlide.domain,
                        order: newOrder[i].order
                    }
                    newSerieSlides.push(newSerieSlide) 
                }  
                setLocalSlides(newSerieSlides)
                // slides load
                var newSelectSlides = []
                slides.forEach(slide => {
                    var selectSlide = {
                        label: slide.name,
                        value: slide.id
                    }
                    newSelectSlides.push(selectSlide)
                })
                setSelectSlides(newSelectSlides)
            }
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [isSlidesInitialized])

    const checkError = () => {
     
        return document.getElementById("reloadDelayInput").style.border === '' && 
            document.getElementById("displayDelayInput").style.border === '' && 
            document.getElementById("transitionDelayInput").style.border === '' && 
            document.getElementById("nameInput").style.border === ''
    }

    // handle(s)
    const handleReloadDelay = (e) => {
        document.getElementById("reloadDelayInput").style.border = ""
        if (!Number.isInteger(e) || e < 5)
        {   
            document.getElementById("reloadDelayInput").style.border = "2px solid red"
        } 

        if ((e !== serie.reloadDelay || 
            displayDelay !== serie.displayDelay || 
            transitionDelay !== serie.transitionDelay || 
            name !== serie.name) && 
            checkError())
           setIsValueChanged(true) 
        else 
           setIsValueChanged(false) 
        setReloadDelay(e)
    }

    const handleDisplayDelay = (e) => {
        document.getElementById("displayDelayInput").style.border = ""
        if (!Number.isInteger(e) || e < 1)
        {   
            document.getElementById("displayDelayInput").style.border = "2px solid red"
        }
        if ((reloadDelay !== serie.reloadDelay || 
            e !== serie.displayDelay || 
            transitionDelay !== serie.transitionDelay || 
            name !== serie.name) && 
            checkError())
           setIsValueChanged(true) 
        else 
           setIsValueChanged(false) 
        setDisplayDelay(e)
    }

    const handleTransitionDelay = (e) => {
        document.getElementById("transitionDelayInput").style.border = ""
        if (!Number.isInteger(e) || e < 0)
        {   
            document.getElementById("transitionDelayInput").style.border = "2px solid red"
        }
        if ((reloadDelay !== serie.reloadDelay || 
            displayDelay !== serie.displayDelay || 
            e !== serie.transitionDelay || 
            name !== serie.name) && 
            checkError())
           setIsValueChanged(true) 
        else 
            setIsValueChanged(false) 
        setTransitionDelay(e)
    }

    const handleName = (e) => {
        document.getElementById("nameInput").style.border = ""
        if (e.target.value !== serie.name && series.find(s => s.name === e.target.value) !== undefined)
        {
            document.getElementById("nameInput").style.border = "2px solid red"
        }
        if ((reloadDelay !== serie.reloadDelay || 
            displayDelay !== serie.displayDelay || 
            transitionDelay !== serie.transitionDelay || 
            e !== serie.name) && 
            checkError())
           setIsValueChanged(true)
        else 
           setIsValueChanged(false) 
        setName(e.target.value)
    }

    const handleErrorSubmit = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    const handleSaveParams = async () => {
        var newParamsSerie = 
            {
                name: name,
                displayDelay: displayDelay,
                reloadDelay: reloadDelay,
                transitionDelay : transitionDelay,
            }

        try {
            await updateParams(serie.id, newParamsSerie)
        } catch (err) {
            console.log(err)
            alert('communication error with the server, please contact a developer')
        }
    }

    const handleAddSlide = async (values) => {
        var newSerieSlide = {
            id: uuid(),
            slideId: values.newSerieSlide,
            order: serie.slides.length
        }
        var tempSlide = slides.find(s => s.id === values.newSerieSlide)
        var newLocalSlide = {
                id: tempSlide.id,
                serieSlideId: newSerieSlide.id,
                name: tempSlide.name,
                webpagePathData: tempSlide.webpagePathData,
                domain: tempSlide.domain,
                order: newSerieSlide.order
        }

        try {
            await addSerieSlide(serie.id, newSerieSlide)
            serie.slides.push(newSerieSlide)
            setLocalSlides([...localSlides, newLocalSlide])
        } catch (err) {
            console.log(err)
            alert('communication error with the server, please contact a developer')
        }
    }

    const handleRemoveSerieSlide = async (serieSlideId) => {
        var newSerieSlides = serie.slides.filter(s => s.id !== serieSlideId)
        var newLocalSlides = localSlides.filter(s => s.serieSlideId !== serieSlideId)

        for (let index = 0; index < newSerieSlides.length; index++) {
            newSerieSlides[index].order = index
            newLocalSlides[index].order = index    
        }

        try {
            await removeSerieSlide(serie.id, serieSlideId)
            serie.slides = newSerieSlides
            setLocalSlides(newLocalSlides)
        } catch (err) {
            console.log(err)
            alert('communication error with the server, please contact a developer')
        }
    }

    return (                       
        <div>
            <Card style={{ margin:'auto', width:600, backgroundColor:'#7dbcea'}} title={<h3>{ serie.name }</h3>} >
                <Form
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    autoComplete="off"
                    onFinish={handleSaveParams}
                    onFinishFailed={handleErrorSubmit}
                >
                    <div style={{ display:'flex', flexDirection:'row' }}>
                        <div>
                            <div style={{ margin:20, marginTop:0}}>
                                <label style={{ display:'block', fontSize:10, fontWeight:'bold'}}>Reload Delay ({'>='} 5) : </label>
                                <InputNumber 
                                            size="small" 
                                            addonAfter="min"
                                            id='reloadDelayInput'
                                            value={reloadDelay}
                                            onChange={handleReloadDelay}       
                                />
                            </div>
                            <div style={{ margin:20}}>
                                <label style={{ display:'block', fontSize:10, fontWeight:'bold'}}>Display Delay ({'>='} 1) : </label>
                                <InputNumber 
                                        size="small" 
                                        addonAfter="s"
                                        id='displayDelayInput'
                                        value={displayDelay}
                                        onChange={handleDisplayDelay}
                                />
                            </div>
                        </div>
                        <div>
                            <div style={{ margin:20, marginTop:0}}>
                                <label style={{ display:'block', fontSize:10, fontWeight:'bold'}}>Transition Delay ({'>='} 0) : </label>
                                <InputNumber 
                                        size="small" 
                                        addonAfter="s"
                                        id='transitionDelayInput'
                                        value={transitionDelay}
                                        onChange={handleTransitionDelay}
                                />
                            </div>
                            <div style={{ margin:20}}>
                                <label style={{ display:'block', fontSize:10, fontWeight:'bold'}}>name : </label>
                                <Input
                                        size="small" 
                                        id='nameInput'
                                        value={name}
                                        style={{ width:200}}
                                        onChange={handleName}
                                />
                            </div>
                        </div>
                    </div> 
                    <div>
                        <Form.Item
                            style={{
                                marginBottom:0,
                                marginRight:12,
                                float:'right'
                            }}
                        >
                            {
                                isValueChanged ? 
                                    <Button type="primary" htmlType="submit">Save</Button>
                                :
                                    <Button type="primary" disabled htmlType="submit">Save</Button>
                            }
                            
                        </Form.Item>
                    </div>  
                </Form>
            </Card>
            <Card 
                style={{ 
                    marginLeft:'auto', 
                    marginRight:'auto', 
                    marginTop:10, 
                    width:600
                }} 
            >
                <Form
                    wrapperCol={{ span: 16 }}
                    style={{ width: 600 }}
                    autoComplete="off"
                    onFinish={handleAddSlide}
                    onFinishFailed={handleErrorSubmit}
                > 
                    <label style={{ display:'block', fontSize:10, fontWeight:'bold' }}>slides : </label>
                    <div style={{ display:'flex', flexDirection:'row'}} >
                        <Form.Item
                            name="newSerieSlide"
                            style={{
                                width: 480,
                                marginBottom:0
                            }}
                            rules={[{ required: true, message: 'Please select a slide ...' }]}
                        >
                            <Select
                                style={{
                                    width: 400,
                                }}
                                allowClear
                                options={selectSlides}
                            />
                        </Form.Item>
                        <Form.Item
                            style={{
                                marginBottom:0
                            }}
                        >
                            <Button type="primary" htmlType="submit">Add</Button>
                        </Form.Item>
                    </div>
                </Form>
            </Card>
            <div>
                <MovableList
                    values={localSlides}
                    onChange={({ oldIndex, newIndex }) => {
                            var newArray = arrayMove(localSlides, oldIndex, newIndex)
                            var newOrder = []
                            
                            for (let index = 0; index < newArray.length; index++) {
                                newArray[index].order = index
                                serie.slides[index].order = index
                                newOrder.push({
                                    id: newArray[index].serieSlideId,
                                    order: index
                                })
                                
                            }
                            console.log(newArray)
                            setLocalSlides(newArray) 
                            updateSlidesOrder(serie.id, newOrder)
                        }
                    }
                    renderList={({ children, props }) => <ul {...props} style={{ padding:0 }}>{ children }</ul>}
                    renderItem={({ value, props }) => (
                        <div {...props} >
                            <Card 
                                style={{ margin:5, width:500, marginLeft:'auto', marginRight:'auto' }}
                                headStyle={{ height:0 }}
                                bodyStyle={{ padding: 5}}
                                title={ 
                                    <div style={{ display: 'flex', flexDirection:'row' }}>
                                        <div style={{  margin:'auto' }}>
                                            { value.order + 1 } - { value.name }
                                        </div>
                                        <div style={{ width:'100%', textAlign:'right' }}>
                                            <Button type="text" style={{ marginLeft:10 }} icon={<MinusOutlined />} onClick={() => handleRemoveSerieSlide(value.serieSlideId)}></Button>
                                        </div>
                                    </div>
                                } 
                                bordered={false}
                            >
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
                            </Card>
                        </div>
                    )}
                />
            </div>
        </div>
    )
}

export default Serie