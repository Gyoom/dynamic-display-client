// npm packages 
import React, { useState, useEffect } from "react";
import { redirect } from "react-router-dom";
// react services
import configService from "services/config";

const Context = React.createContext(null)

    
const ProviderWrapper = (props) => {
    const [ isConfigInitialized, setIsConfigInitialized ] = useState(false)
    const [ isConfigUpToDate, setIsConfigUpToDate ] = useState(true)
    const [ config, setConfig ] = useState(
    )
    

    const hook = () => {
        configService
        .get()
        .then(newConfig =>{
            setConfig(newConfig)
            setIsConfigInitialized(true)
        })

    }

    useEffect(hook, [])

    const changeConfig = async (newConfig) => {
        await configService.change(newConfig)
        setConfig(newConfig)
        setIsConfigUpToDate(false)
    }

    
    const exposedValue = {
        isConfigInitialized, 
        setIsConfigInitialized,
        isConfigUpToDate,
        setIsConfigUpToDate,
        config,
        changeConfig,
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