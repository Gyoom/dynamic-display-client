import React,{ useEffect, useState } from "react";
import loadingGif from "../../Assets/loading/loading.gif"
import screenshots from "services/screenshots"; 

const loadStyle = {
    display: "block", 
    marginRight: 'auto', 
    marginLeft:'auto', 
    marginTop: '15%', 
    height:'40%', 
    width:'40%'
}

var time = false

const DisplayPage = () => {
    const [displayIsActive, setDisplayIsActive] = useState(false);
    const [timeToReload, setTimeToReload] = useState(false);
    const UPDATE_DISPLAY_DELAY = 10 * 1000;
    const RELOAD_DELAY= 20 * 60 * 1000;
    var slides = []
    var slidesIndex = 0


    useEffect(() => {
        const interval = setInterval(() => {
            time = true
        }, RELOAD_DELAY);

        return () => clearInterval(interval);
    }, [])

    const delay = ms => new Promise(res => setTimeout(res, ms))

    const toBlack = () => {
        document.body.style.transition = "opacity 3s"
        document.body.style.opacity = 0
    }
  
    const toWhite = () => {
        document.body.style.transition = "opacity 3s"
        document.body.style.opacity = 1
    }

    const getScreenshot = async () => {
        console.log("Start loading")
        slides = []
        slidesIndex = 0
        slides = await screenshots.getAll()
        console.log("Finish loading")
        toBlack()
        await delay(3000)

        document.getElementById('img').style = {}
        document.getElementById('img').style.height = '100%'
        document.getElementById('img').style.width = '100%'
        document.getElementById('img').setAttribute('src', slides[slidesIndex]);

        toWhite()
        await delay(3000)

        slidesIndex++;
        console.log("displayed")
    }

    const displaySlideshow = async () => {
        while (true)
        {
            if (time)
            {
                await getScreenshot()
                time = false
            }

            await delay(UPDATE_DISPLAY_DELAY)
            
            if (slides.length > 0)
            {
                toBlack()
                await delay(3000)
                document.getElementById('img').setAttribute('src', slides[slidesIndex]);
                toWhite()
                await delay(3000)
                
                if (slidesIndex === slides.length - 1)
                    slidesIndex = 0
                else
                    slidesIndex++
            }
        }
    }

    const initSlideshow = async () => {
        if (displayIsActive)
            return
        
        setDisplayIsActive(true)
        time = false

        await getScreenshot()
        displaySlideshow()

    }

    initSlideshow()

    return (
        <>
            <img id="img" style={loadStyle} src={loadingGif} ></img>
        </>
    )

}

export default DisplayPage