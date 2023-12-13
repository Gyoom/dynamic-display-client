// npm packag(s)
import React,{ useState, useEffect, useContext } from "react"
import { Button } from 'antd'
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
// local file(s)
import loadingGif from "../../Assets/loading/loading.gif"
import pausePng from '../../Assets/pause.512x512.png'
// react service(s)
import slidesService from "services/slides"
import configService from "services/config"
// react context(s)
import { Context as ConfigContext } from "contexts/configContext"
// css file(s)
import './DisplayPage.css'


// javascript variables
var slides = []
var activesLoop = 0
var picturesIndex = 0
var isManualMoveActive = false
var config = null
var clickCount = 0
var isLoopStoppedJava = false

function Viewpager() {
    const width = window.innerWidth
  
    const [props, api] = useSprings(slides.length, i => ({
      x: i * width,
      scale: 1,
      display: 'block',
    }))

    // drag change
    const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel }) => {
      if (active && Math.abs(mx) > width / 6) {
        picturesIndex = picturesIndex + (xDir > 0 ? -1 : 1)
        if (picturesIndex < 0)
            picturesIndex = slides.length - 1
        else if (picturesIndex === slides.length)
            picturesIndex = 0
        cancel()
      }
      api.start(i => {
        if (i < picturesIndex - 1 || i > picturesIndex + 1) return { display: 'none' }
        const x = (i - picturesIndex) * width + (active ? mx : 0)
        const scale = active ? 1 - Math.abs(mx) / width / 2 : 1
        return { x, scale, display: 'block' }
      })
    })

    // dynamic and button change
    document.body.addEventListener("changeSlideDisplayed", (e) => {

        picturesIndex = picturesIndex + e.detail
        console.log(picturesIndex)
        if (picturesIndex === slides.length)
            picturesIndex = 0
        if (picturesIndex < 0)
            picturesIndex = slides.length - 1

        api.start(i => {
            const x = (i - picturesIndex) * width + (i > picturesIndex ? width : 0)
            const scale = 1
            return { x, scale, display: 'block' }
        })
    
        }, false);

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

const DisplayPage = () => {
    // use state(s)
    const [isLoopStopped, setIsLoopStopped] = useState(false)
    const [isLoadHasBegin, setIsLoadHasBegin] = useState(false)
    const [isDisplayIsVisible, setIsDisplayIsVisible] = useState(false)

    // functions
    // delay function
    const delay = ms => new Promise(res => setTimeout(res, ms))
    
    // transition first part
    const toBlack = async () => {
        document.body.style.transition = "opacity " + config.transitionDelay / 2 +"s"
        document.body.style.opacity = 0
        await delay((config.transitionDelay / 2) * 1000)
    }
  
    // transition second part
    const toWhite = async () => {
        document.body.style.transition = "opacity " + config.transitionDelay / 2 +"s"
        document.body.style.opacity = 1
        await delay((config.transitionDelay / 2) * 1000)
    }
    
    // load initials Slides
    const loopStarter = async () => {
        console.log("Start loading")
        // load config
        try {
            config = await configService.get()
        } catch (e) {
            console.log('Get initial config', e)
            config = null
            alert("communication error with server, please reload the tab.\n if the problem persist, please call a dev")    
            return
        }
        // load picture
        var rawSlides = []
        try {
            rawSlides = await slidesService.getAllToDisplay()
        } catch (e) {
            console.log('Get initial slides', e)
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

        // click manager
        var background = document.getElementById('wrapper')
        background.addEventListener('click', async () => {
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
        } catch (e) {
            console.log('Get initial config', e)
            config = null   
            return
        }

        // check server has reload
        if (newConfig.lastLoadDate === config.lastLoadDate)
            return

        // load picture
        var rawSlides = []
        try {
            rawSlides = await slidesService.getAllToDisplay()
        } catch (e) {
            console.log('Get initial slides', e)
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

        // update div background
        for (let index = 0; index < slides.length; index++) {
            var backgroundDiv = document.getElementById('picture' + index)
            if (backgroundDiv !== (null || undefined))
            {
                try 
                {
                    backgroundDiv.style.backgroundImage = "url('" + newSlides[index].picture + "')"
                } catch (e){
                    console.log(e)
                    console.log('error ', backgroundDiv)
                    return
                }
                console.log('picture ' + index + ' reloaded')  
            }   
        }

        config = newConfig
    }

    const carousel = async () => {
        console.log('loop')
        activesLoop++
        while (true)
        {   
            isManualMoveActive = false
            // check actives loops
            if (activesLoop > 1)
            {
                activesLoop--
                return
            }
            
            // check is time to reload
            if((new Date().getTime() - (new Date(config.lastLoadDate).getTime())) > (config.reloadDelay * 60 * 1000))
            {
                await reload()
            }

            // wait next transition
            await delay(config.displayDelay * 1000)


            if (!isManualMoveActive && !isLoopStoppedJava)
            {
                // start first part transition  
                await toBlack()
                document.body.dispatchEvent(new CustomEvent("changeSlideDisplayed", { detail: 1 }))
                await delay(500)
                console.log('picture ' + picturesIndex + ' displayed')
                // start second transition
                await toWhite()    
            }
        }
    }

    const previous = () => {
        isManualMoveActive = true
        const changeSlideDisplayed = new CustomEvent("changeSlideDisplayed", { detail: -1 })
        document.body.dispatchEvent(changeSlideDisplayed)
       
    }

    const next = () => {
        isManualMoveActive = true
        const changeSlideDisplayed = new CustomEvent("changeSlideDisplayed", { detail: 1 })
        document.body.dispatchEvent(changeSlideDisplayed)
    }



    // init 
    const initSlideshow = async () => {
        // check only one loop 
        if (isLoadHasBegin)
            return
        setIsLoadHasBegin(true)
        // load pictures
        await loopStarter()

    }
    initSlideshow()

    return (
        <>
            { isDisplayIsVisible ?
                <>
                    <div className="flex fill center">
                        <Viewpager />
                        <div style={{ position: 'fixed', bottom: '2%', left: '1%'}}>
                            <Button id='manualTransitionButton' style={{ display:'block' }} onClick={previous} >Previous</Button>
                            <Button id='manualTransitionButton' onClick={next} >Next</Button>
                        </div> 
                        <div style={{ textAlign:'right', position: 'fixed', bottom: '2%', right: '1%'}}>
                            <Button id='manualTransitionButton' style={{display:'block' }} onClick={previous} >Previous</Button>
                            <Button id='manualTransitionButton' onClick={next} >Next</Button>
                        </div>
                        { isLoopStopped ? <img id="breakImg" style={{ position:'fixed', height:'40%', margin:'auto', opacity:0.1}} src={pausePng} ></img> : '' }
                    </div>       
                </>
            : <img id="img" style={{ display:'block', marginRight:'auto', marginLeft:'auto', marginTop:'15%', height:'40%'}} src={loadingGif} ></img> }
        </>
    )

}

export default DisplayPage