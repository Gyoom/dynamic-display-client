// npm packag(s)
import React,{ useState, useEffect, useContext } from "react"
import { Layout, Card, Button, InputNumber } from 'antd'
// local file(s)
import loadingGif from "../../Assets/loading/loading.gif"
// react service(s)
import picturesService from "services/pictures"
import slidesService from "services/slides"
// react context(s)
import { Context as ConfigContext } from "contexts/configContext"

// javascript variables
const loadStyle = {
    display: "block", 
    marginRight: 'auto', 
    marginLeft:'auto', 
    marginTop: '15%', 
    height:'40%', 
}
var timeToReload = false
var loadIndex = 0
var displayDelay = 10 * 1000
var reloadDelay = 20 * 60 * 1000
var transitionDelay = 2
var slides = []
var slidesIndex = 0
var activesLoop = 0

const DisplayPage = () => {
    // use context(s)
    const { isConfigInitialized, config } = useContext(ConfigContext)
    // use state(s)
    const [isLoadHasBegin, setIsLoadHasBegin] = useState(false)
    const [isDisplayIsVisible, setIsDisplayIsVisible] = useState(false)

    // use effect(s)
    // timer next load pictures
    useEffect(() => {
        const interval = setInterval(() => {
            if (loadIndex === 0)
            {
                timeToReload = true
            }
        }, reloadDelay)

        return () => clearInterval(interval)
    }, [])

    // init the config
    useEffect(() => {
        if (isConfigInitialized)
        {
            displayDelay = config.displayDelay * 1000
            reloadDelay = config.reloadDelay * 60 * 1000
            transitionDelay = config.transitionDelay
        }
    }, [isConfigInitialized])

    // functions
    // delay function
    const delay = ms => new Promise(res => setTimeout(res, ms))
    
    // transition first part
    const toBlack = async () => {
        document.body.style.transition = "opacity " + transitionDelay / 2 +"s" // Todo
        document.body.style.opacity = 0
        await delay((2 / 2) * 1000)
    }
  
    // transition second part
    const toWhite = async () => {
        document.body.style.transition = "opacity " + transitionDelay / 2 +"s"
        document.body.style.opacity = 1
        await delay((transitionDelay / 2) * 1000)
    }

    // change the display of webpage
    const displaySlide = (direction) => {
        console.log("slide " + slidesIndex + " is displayed")

        if (!direction)
        {
            slidesIndex = slidesIndex - 2
            if (slidesIndex === -1)
                slidesIndex = slides.length - 1
            else if (slidesIndex === -2)
                slidesIndex = slides.length - 2
        }

        document.getElementById('img').setAttribute('src', slides[slidesIndex].picture)
        
        if (slidesIndex === slides.length - 1)
            slidesIndex = 0
        else
            slidesIndex++
    }
    
    // load initials Slides
    const getInitialsSlides = async () => {
        // load picture
        console.log("Start loading")
        var rawSlides = []
        slidesIndex = 0
    
        rawSlides = await slidesService.getAllToDisplay().catch(e => {
            console.log(e)
            alert("communication error with server, please reload")    
            return
        })
        console.log("Finish loading")

        // check if available picture exist
        if (rawSlides.length === 0 || rawSlides.find(s => s !== "") == undefined)
        {
            alert("No available images")
            document.getElementById('img').remove()
            return
        }

        slides = []
        rawSlides.forEach(rawSlide => {
            if(rawSlide.picture !== "")
            {
                slides.push(rawSlide)
            }
        })
        loadIndex = slides.length
        timeToReload = false
        // start first part transition   
        await toBlack()
        // display first picture
        document.getElementById('img').style = {}
        document.getElementById('img').style.height = '100%'
        document.getElementById('img').style.width = '100%'
        displaySlide(true)
        setIsDisplayIsVisible(true)
        // start second transition
        await toWhite() 

        // begin endless picture display
        carousel()

    }

    const reloadSlidePicture = async () => {
        slides[slidesIndex].picture = await picturesService.getOneById(slides[slidesIndex].id)
        .catch(e => {
            console.log(e)  
            return
        })
        loadIndex--
    }

    const carousel = async () => {
        activesLoop++
        while (true)
        {   
            // check actives loops
            if (activesLoop > 1)
            {
                activesLoop--
                return
            }

            // check time to load picture
            if (timeToReload)
            {
                await getInitialsSlides()
            }
            if (loadIndex > 0)
            {
                // wait reload image and de
                await Promise.all([reloadSlidePicture(), delay(displayDelay)])
            } 
            else 
            {
                // wait next transition
                await delay(displayDelay)
            }
            
            // start first part transition   
            await toBlack()
            // display next available picture
            displaySlide(true)
            // start second transition
            await toWhite()  
    
        }
    }

    // init 
    const initSlideshow = async () => {
        // check only one loop 
        if (isLoadHasBegin)
            return
        setIsLoadHasBegin(true)
        // load pictures
        await getInitialsSlides()

    }

    const previous = () => {
        console.log('previous')
        displaySlide(false)
        carousel()
    }

    const next = () => {
        console.log('next')
        displaySlide(true)
        carousel()
    }

    initSlideshow()

    return (
        <>
            <img id="img" style={loadStyle} src={loadingGif} ></img>
            { isDisplayIsVisible ?
                <>
                    <div style={{ position: 'fixed', bottom: '2%', left: '1%'}}>
                        <Button style={{ display:'block', margin:2, height:35, width:80}} onClick={previous} >Previous</Button>
                        <Button style={{ margin:2, height:35, width:80}} onClick={next} >Next</Button>
                    </div> 
                    <div style={{ textAlign:'right', position: 'fixed', bottom: '2%', right: '1%'}}>
                        <Button style={{display:'block', height:35, width:80, margin:2}} onClick={previous} >Previous</Button>
                        <Button style={{ margin:2 , height:35, width:80 }} onClick={next} >Next</Button>
                    </div>
                </>
            : "" }
        </>
    )

}

export default DisplayPage