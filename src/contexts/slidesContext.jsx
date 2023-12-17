// npm packages 
import React, { useState, useEffect } from "react";
import { redirect } from "react-router-dom";
// react services
import slideServices from "services/slides";

const Context = React.createContext(null)

    
const ProviderWrapper = (props) => {
    const [ isSlidesInitialized, setIsSlidesInitialized ] = useState(false)
    const [ slides, setSlides ] = useState([])
    

    const hook = () => {
        slideServices
        .getAll()
        .then(dbSlides =>{
            setSlides(dbSlides)
            setIsSlidesInitialized(true)
        })
    }
    useEffect(hook, [])

    const addSlide = async (newSlide) => {
        setSlides([...slides, newSlide])
        await slideServices.createOne(newSlide)
    }

    const removeSlide = async (id) => {
        setSlides(slides.filter(s => s.id !== id))
        await slideServices.removeOneById(id)
    }

    
    const exposedValue = {
        slides,
        addSlide,
        removeSlide,
        isSlidesInitialized
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