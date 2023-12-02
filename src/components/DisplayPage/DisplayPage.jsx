import React,{ useState, useEffect, useContext } from "react"
import loadingGif from "../../Assets/loading/loading.gif"
// react services
import picturesService from "services/pictures"
// react contexts
import { Context as ConfigContext } from "contexts/configContext"

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
    const { 
        isConfigInitialized, 
        setIsConfigInitialized, 
        isConfigUpToDate, 
        config 
    } = useContext(ConfigContext)
    const [displayIsActive, setDisplayIsActive] = useState(false)
    const [stopDisplay, setStopDispay] = useState(false)
    var updateDisplayDelay = 10 * 1000
    var reloadDelay = 20 * 60 * 1000
    var slides = []
    var slidesIndex = 0

    // timer next load pictures
    useEffect(() => {
        const interval = setInterval(() => {
            time = true
        }, reloadDelay)

        return () => clearInterval(interval)
    }, [])

    // keep the config up to date
    useEffect(() => {
        if (isConfigInitialized)
        {
            console.log(config)
            updateDisplayDelay = config.updateDisplayDelay * 1000
            reloadDelay = config.updateDisplayDelay * 60 * 1000
            setIsConfigInitialized(false)
        }
        else if(!isConfigUpToDate)
        {
            location.replace(location.href)  
        }
    }, [isConfigUpToDate, isConfigInitialized])

    // delay function
    const delay = ms => new Promise(res => setTimeout(res, ms))
    
    // transition first part
    const toBlack = () => {
        document.body.style.transition = "opacity 3s"
        document.body.style.opacity = 0
    }
  
    // transition second part
    const toWhite = () => {
        document.body.style.transition = "opacity 3s"
        document.body.style.opacity = 1
    }
    
    // load picture
    const getPictures = async () => {
        // load picture
        console.log("Start loading")
        slides = []
        slidesIndex = 0
        slides = await picturesService.getAll()
        console.log("Finish loading")

        // start first part transition
        toBlack()
        await delay(3000)

        // check if available picture exist
        if (slides.length === 0 || slides.find(s => !s.startsWith('404')) == undefined)
        {
            setStopDispay(true)
            alert("No available images")
            return
        }

        // display first available picture
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

        // start second part first transition
        toWhite()
        await delay(3000)
    }

    const displaySlideshow = async () => {
        // check no existing picture
        if (stopDisplay)
            return
        while (true)
        {
            // // check time to load picture
            if (time)
            {
                await getPictures()
                time = false
            }

            // wait next transition
            await delay(updateDisplayDelay)
            
            // start first part transition   
            toBlack()
            await delay(3000)

            // display next available picture
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

            // start second transition
            toWhite()
            await delay(3000)     
    
        }
    }
    // init 
    const initSlideshow = async () => {
        // check only one loop 
        if (displayIsActive)
            return
        
        setDisplayIsActive(true)
        time = false
        // load pictures
        await getPictures()
        // endless picture display
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