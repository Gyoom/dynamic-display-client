// npm packages 
import React, { useState, useEffect } from "react"
// react services
import serieServices from "services/series"

const Context = React.createContext(null)

    
const ProviderWrapper = (props) => {
    const [ isSeriesInitialized, setIsSeriesInitialized ] = useState(false)
    const [ series, setSeries ] = useState([])
    

    const hook = () => {
        serieServices
        .getAll()
        .then(dbSeries =>{
            setSeries(dbSeries)
            setIsSeriesInitialized(true)
        })

    }

    useEffect(hook, [])

    const addSerie = async (newSerie) => {
        setSeries([...series, newSerie])
        await serieServices.createOne(newSerie)
    }

    const addSerieSlide = async (serieId, newSerieSlide) => {
        await serieServices.addSlide(serieId, newSerieSlide)
    }

    const removeSerie = async (id) => {
        setSeries(series.filter(s => s.id !== id))
        await serieServices.removeOneById(id)
    }

    const removeSerieSlide = async (serieId, serieSlideId) => {
        var body = {
            serieSlideId: serieSlideId
        }
        await serieServices.removeSlide(serieId, body)
    }

    const updateSlidesOrder = async (serieId, newOrder) => {
        await serieServices.updateSlidesOrder(serieId, newOrder)
    }

    const updateParams = async (serieId, newParams) => {
        await serieServices.updateParams(serieId, newParams)
    }

    
    const exposedValue = {
        series,
        isSeriesInitialized,
        addSerie,
        addSerieSlide,
        removeSerie,
        removeSerieSlide,
        updateSlidesOrder,
        updateParams
    }
    
    return (
        <Context.Provider value={exposedValue}>
            { props.children }
        </Context.Provider> 
        )   
}
    
export {    
    Context,
    ProviderWrapper,    
}