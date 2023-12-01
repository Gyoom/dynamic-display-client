import React,{ useEffect, useState } from "react";
import loadingGif from "../../Assets/loading/loading.gif"
// react services
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
    const [stopDisplay, setStopDispay] = useState(false);
    const UPDATE_DISPLAY_DELAY = 30 * 1000;
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

        if (slides.length === 0 || slides.find(s => !s.startsWith('404')) == undefined)
        {
            setStopDispay(true)
            alert("No available images")
            return
        }

        for (let index = 0; index < slides.length; index++) {
            if (!slides[slidesIndex].startsWith('404')) 
            {
                document.getElementById('img').style = {}
                document.getElementById('img').style.height = '100%'
                document.getElementById('img').style.width = '100%'
                document.getElementById('img').setAttribute('src', slides[slidesIndex]);
                console.log("slide " + slidesIndex + " is displayed")
                slidesIndex++
                break;
            }
            else 
            {
                console.log("slide " + slidesIndex + " cannot be made")
                slidesIndex++
            }
        }

        if (slidesIndex >= slides.length)
            slidesIndex = 0


        toWhite()
        await delay(3000)
    }

    const displaySlideshow = async () => {
        if (stopDisplay)
            return
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


                for (let index = 0; index < slides.length; index++) {
                    if (!slides[slidesIndex].startsWith('404')) 
                    {
                        console.log("slide " + slidesIndex + " is displayed")
                        document.getElementById('img').setAttribute('src', slides[slidesIndex])

                        if (slidesIndex === slides.length - 1)
                            slidesIndex = 0
                        else
                            slidesIndex++
                        break
                    }
                    else 
                    {
                        console.log("slide " + slidesIndex + " cannot be made")
                        
                        if (slidesIndex === slides.length - 1)
                            slidesIndex = 0
                        else
                            slidesIndex++
                    }
                    
                }
                
                toWhite()
                await delay(3000)     
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