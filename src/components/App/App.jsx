import React,{ useEffect, useState, useContext } from "react";
import { useNavigate, Link, Route, Routes, useMatch } from 'react-router-dom'
import ConfigPage from "components/ConfigPage/ConfigPage"
import DisplayPage from "components/DisplayPage/DisplayPage"



const App = () => {

    const match = useMatch('/display/:id')
    const serieId = match ? match.params.id : null
    
    return (
        <>
            <Routes>
                <Route path="/display/:id" element={<DisplayPage serieId={serieId} />} />
                <Route path="/config" element={<ConfigPage />} />
            </Routes>
        </>
    )
}

export default App