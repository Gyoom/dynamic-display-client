// npm packag(s)
import React,{ useState, useEffect } from "react"
import { Button } from 'antd'
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
// local file(s)
import loadingGif from "../../Assets/loading/loading.gif"
import pausePng from '../../Assets/pause.512x512.png'
// react service(s)
import slidesService from "services/slides"
import seriesService from "services/series"
import configService from "services/config"
// css file(s)
import './DisplayPage.css'


// javascript variables
var slides = []
var picturesIndex = 0
var isManualMoveActive = false
var config = null
var clickCount = 0
var isLoopStoppedJava = false
var serie = {}

// viewpager
function Viewpager() {
    const width = window.innerWidth
  
    const [props, api] = useSprings(slides.length, i => ({
      x: i * width,
      scale: 1,
      display: 'block',
    }))

    // manual drag change
    const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
        if (active && Math.abs(mx) > width / 6) {
            picturesIndex = picturesIndex + (xDir > 0 ? -1 : 1)
            if (picturesIndex < 0)
                picturesIndex = slides.length - 1
            else if (picturesIndex === slides.length)
                picturesIndex = 0
            cancel()
        
            api.start(i => {
                if (i < picturesIndex - 1 || i > picturesIndex + 1) 
                    return { display: 'none' }
                const x = (i - picturesIndex) * width + (i > picturesIndex ? width : 0)
                const scale = 1 
                return { x, scale, display: 'block' }
            })
        }
    })

    useEffect(() => {
        // dynamic and manual button change
        document.addEventListener("changeSlideDisplayed", (e) => {
            picturesIndex = picturesIndex + e.detail
            if (picturesIndex === slides.length)
                picturesIndex = 0
            if (picturesIndex < 0)
                picturesIndex = slides.length - 1
            api.start(i => {
                if (i < picturesIndex - 1 || i > picturesIndex + 1) 
                    return { display: 'none' }
                const x = (i - picturesIndex) * width + (i > picturesIndex ? width : 0)
                const scale = 1
                return { x, scale, display: 'block' }
            })
    
        }, false)
    }, []);

    return (
        <div id="wrapper">
            {props.map(({ x, display, scale }, i) => (
                <animated.div className="page" {...bind()} key={i} style={{ display, x }}>
                    <animated.div id={'picture' + i} style={{ scale, backgroundImage: "url('" + slides[i].picture + "')" }} />
                </animated.div>
            ))}
        </div>
    )
  }

const DisplayPage = ({ serieId }) => {
    // use state(s)
    const [isLoopStopped, setIsLoopStopped] = useState(false)
    const [isLoadHasBegin, setIsLoadHasBegin] = useState(false)
    const [isDisplayIsVisible, setIsDisplayIsVisible] = useState(false)

    // functions
    // delay function
    const delay = ms => new Promise(res => setTimeout(res, ms))
    
    // transition first part
    const toBlack = async () => {
        document.body.style.transition = "opacity " + serie.transitionDelay / 2 +"s"
        document.body.style.opacity = 0
        await delay((serie.transitionDelay / 2) * 1000)
    }
  
    // transition second part
    const toWhite = async () => {
        document.body.style.transition = "opacity " + serie.transitionDelay / 2 +"s"
        document.body.style.opacity = 1
        await delay((serie.transitionDelay / 2) * 1000)
    }

    // display previous picture manually
    const manualPrevious = () => {
        isManualMoveActive = true
        document.dispatchEvent(new CustomEvent("changeSlideDisplayed", { detail: -1 }))
       
    }

    // display next picture manually
    const manualNext = () => {
        isManualMoveActive = true
        document.dispatchEvent(new CustomEvent("changeSlideDisplayed", { detail: 1 }))
    }
    
    // load initials Slides
    const loopStarter = async () => {
        console.log("Start loading")
        var rawSlides = []
        try {
            // load current serie
            serie = await seriesService.getOneById(serieId)
            // load genral config
            config = await configService.get()
            // load slides
            rawSlides = await slidesService.getBySerieId(serie.id)
        } catch (err) {
            console.log(err)
            alert("communication error with server, please reload the tab.\n if the problem persist, please call a dev")    
            return
        }
        // remove unused picture
        slides = []
        rawSlides.forEach(rawSlide => {
            if(rawSlide.picture !== "")
            {
                slides.push(rawSlide)
            }
        })
        // check if available picture exist
        if (slides.length === 0)
        {
            alert("No available images")
            return
        }
        console.log("Finish loading")

        // display viewPager 
        await toBlack()
        setIsDisplayIsVisible(true)
        console.log('picture ' + picturesIndex + ' displayed')
        await toWhite() 

        // define pause click manager
        var background = document.getElementById('clickable')
        background.addEventListener('click', async () => {
            if (isLoopStoppedJava)
            {
                setIsLoopStopped(false)
                isLoopStoppedJava = false
            }
            clickCount++
            if (clickCount === 2)
            {
                setIsLoopStopped(!isLoopStoppedJava)
                isLoopStoppedJava = !isLoopStoppedJava
            }    
            setTimeout(() => clickCount = 0, 500)
        })

        // begin endless picture display
        carousel()
    }

    const reload = async () => {
        // load config
        var newConfig = null
        try {
            newConfig = await configService.get()
        } catch (err) {
            console.log('reload config : ', err)
            config = null   
            return
        }

        // check server has reload
        if (newConfig.lastLoadDate === config.lastLoadDate)
            return

        // load picture
        var rawSlides = []
        try {
            rawSlides = await slidesService.getBySerieId(serie.id)
        } catch (err) {
            console.log('reload slides : ', err)
            return
        }
        // remove unused picture
        var newSlides = []
        rawSlides.forEach(rawSlide => {
            if(rawSlide.picture !== "")
            {
                newSlides.push(rawSlide)
            }
        })
        // check if available picture exist
        if (slides.length === 0)
        {
            console.log('no available image')
            return
        }

        // update div background in viewpager
        for (let index = 0; index < slides.length; index++) {
            var backgroundDiv = document.getElementById('picture' + index)
            if (backgroundDiv !== (null || undefined))
            {
                try 
                {
                    backgroundDiv.style.backgroundImage = "url('" + newSlides[index].picture + "')"
                } catch (err){
                    console.log(err)
                    console.log('diplay reloaded slides ' + index + ' : ', err)
                    return
                }
                console.log('Slide ' + index + ' reloaded')  
            }   
        }

        config = newConfig
    }

    const carousel = async () => {
        while (true)
        {   
            isManualMoveActive = false
            
            // check is time to reload
            if((new Date().getTime() - (new Date(config.lastLoadDate).getTime())) > (serie.reloadDelay * 60 * 1000))
            {
                await reload()
            }

            // wait next transition
            await delay(serie.displayDelay * 1000)

            if (!isManualMoveActive && !isLoopStoppedJava)
            {
                // start first part transition  
                await toBlack()
                document.dispatchEvent(new CustomEvent("changeSlideDisplayed", { detail: 1 }))
                await delay(500)
                console.log('picture ' + picturesIndex + ' displayed')
                // start second transition
                await toWhite()    
            }
        }
    }

    // start function
    const initSlideshow = async () => {
        // check only one loop 
        if (isLoadHasBegin)
            return
        setIsLoadHasBegin(true)
        // start loop
        loopStarter()
    }
    initSlideshow()

    return (
        <>
            { 
                isDisplayIsVisible ?
                    <>
                        <div style={{ height:'100%', width:'100%' }}>
                            <div id='clickable' className="flex fill center"> 
                                { /* Vewpager */ }
                                <Viewpager />
                                { /* pause picture */ }
                                { isLoopStopped ? <img id="breakImg" style={{ position:'fixed', height:'40%', margin:'auto', opacity:0.1}} src={pausePng} ></img> : '' }
                            </div>
                            { /* manual Move buttons */ }
                            <div style={{ position: 'fixed', bottom: '2%', left: '1%'}}>
                                <Button id='manualTransitionButton' style={{ display:'block' }} onClick={manualPrevious} >Previous</Button>
                                <Button id='manualTransitionButton' onClick={manualNext} >Next</Button>
                            </div> 
                            <div style={{ textAlign:'right', position: 'fixed', bottom: '2%', right: '1%'}}>
                                <Button id='manualTransitionButton' style={{display:'block' }} onClick={manualPrevious} >Previous</Button>
                                <Button id='manualTransitionButton' onClick={manualNext} >Next</Button>
                            </div>
                        </div>       
                    </> 
                : 
                <>
                    { /* wait gif */ }
                    <img id="img" style={{ display:'block', marginRight:'auto', marginLeft:'auto', marginTop:'15%', height:'40%'}} src={loadingGif} ></img>
                </> 
            }
        </>
    )

}

export default DisplayPage