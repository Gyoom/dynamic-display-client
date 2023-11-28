import React,{ useEffect, useState } from "react";
import { useNavigate, Link, Route, Routes, useMatch } from 'react-router-dom'
import ConfigPage from "components/ConfigPage/ConfigPage";
import DisplayPage from "components/DisplayPage/DisplayPage";
const App = () => {

    
    return (
        <>
            <Routes>
                <Route path="/" element={<DisplayPage />} />
                <Route path="/config" element={<ConfigPage />} />
            </Routes>
        </>
    )
}

export default App