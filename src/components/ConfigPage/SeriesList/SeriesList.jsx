// npm package(s)
import React,{ useState, useContext } from "react"
import { Link } from 'react-router-dom'
import { Button, Input, List } from 'antd'
import VirtualList from 'rc-virtual-list'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { v4 as uuid } from 'uuid';
// react context(s)
import { Context as SeriesContext } from "contexts/seriesContext"
// css file(s)
import './SeriesList.css'


const SeriesList = ({ setCentralColumnDisplay, setCurrentSerie }) => {
    // use Context(s)
    const { series, addSerie, removeSerie } = useContext(SeriesContext)
    // use state(s)
    const [newSerieName, setNewSerieName] = useState('')
    const [isError, setIsError] = useState(false)

    const changeNewSerieName = (e) => {
        setIsError(false)
        document.getElementById("addSerieInput").style.border = ""
        for (let index = 0; index < series.length; index++) {
            if (series[index].name === e.target.value)
            {
                document.getElementById("addSerieInput").style.border = "2px solid red"
                setIsError(true)
            } 
        }
        setNewSerieName(e.target.value)
    }
    
    const handleAddSerie = async () => {
        if (newSerieName === '' || isError)
            return
        // generate new id
        var id = 0
        for (let index = 0; index < series.length; index++) {
            id = series[index].id > id ? series[index].id + 1 : id 
        }
        var newSerie = {
            id: id,
            name: newSerieName,
            slides: []
        }
        await addSerie(newSerie)
        setNewSerieName('')
    }

    const handleRemoveSerie = (serieToRemove) => {
        removeSerie(serieToRemove.id)
    }

    const handleDisplaySerie = (serie, column) => {
        setCurrentSerie(serie)
        setCentralColumnDisplay(column)
    }
    
    return (
        <>
            <List
                size="small"
                style= {{ border: '1px solid', backgroundColor:'#1e2842', color:'#fff' }}
                bordered
                header=
                    {
                        <div style={{  width:'100%', display: 'flex', flexDirection:'row' }}>
                            <div style={{  margin:'auto', fontWeight:'bold' }}>
                                Series
                            </div>
                            <div style={{ width:'100%', textAlign:'right', }}>
                                <Input
                                    placeholder="Please add a serie"
                                    id="addSerieInput"
                                    value={newSerieName}
                                    onChange={changeNewSerieName}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    
                                />
                                <Button type="text" style={{ marginLeft:10, color:'#fff' }} icon={<PlusOutlined />} onClick={handleAddSerie}>
                                </Button>
                            </div>
                        </div>
                    }
            >
                <VirtualList
                    data={series}
                    height=
                    {
                        series.length * 50 < window.screen.height / 2.1 ? series.length * 50  : window.screen.height / 2.1
                    }
                    itemHeight={series.length}
                    itemKey="id"   
                >
                    {(serie) => (
                        <List.Item style= {{ borderTop: '1px solid' }}>
                            <List.Item.Meta
                                title={
                                    <>
                                        <Button type="text" style={{ fontWeight:'bold' }} onClick={() => handleDisplaySerie(serie, 'serie')}>
                                            { serie.name }
                                        </Button>
                                        <Link style={{ marginLeft:30 }} to={'/display/' + serie.id } >{ import.meta.env.VITE_URL_SERVER + "/display/" + serie.id }</Link>
                                        <span style={{ marginLeft:40, fontWeight:'normal' }}>
                                            { '(' + serie.slides.length + ' slides)' }
                                        </span>
                                    </>
                                }
                            /> 
                            
                            <Button type="text" style={{ marginLeft:2, marginRight:2, color:'#fff' }} icon={<MinusOutlined />} onClick={() => handleRemoveSerie(serie)}></Button>
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </>
    )
}

export default SeriesList