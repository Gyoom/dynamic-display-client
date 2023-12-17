// npm packages 
import React, { useState, useEffect } from "react";
import { redirect } from "react-router-dom";
// react services
import configService from "services/config";

const Context = React.createContext(null)

    
const ProviderWrapper = (props) => {
    const [ isConfigInitialized, setIsConfigInitialized ] = useState(false)
    const [ config, setConfig ] = useState()
    

    const hook = () => {
        configService
        .get()
        .then(newConfig =>{
            setConfig(newConfig)
            setIsConfigInitialized(true)
        })

    }

    useEffect(hook, [])
    
    const exposedValue = {
        isConfigInitialized, 
        setIsConfigInitialized,
        config,
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