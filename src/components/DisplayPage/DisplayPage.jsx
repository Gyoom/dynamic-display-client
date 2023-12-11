// npm packag(s)
import React,{ useState, useEffect, useContext } from "react"
import { Button } from 'antd'
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
// local file(s)
import loadingGif from "../../Assets/loading/loading.gif"
// react service(s)
import picturesService from "services/pictures"
import slidesService from "services/slides"
// react context(s)
import { Context as ConfigContext } from "contexts/configContext"
// css file(s)
import './DisplayPage.css'

// javascript variables
var loadIndex = 0
var loadCount = 0
var displayDelay = 10 * 1000
var reloadDelay = 20 * 60 * 1000
var transitionDelay = 2
var slides = []
var activesLoop = 0
var index = 0

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
        index = index + (xDir > 0 ? -1 : 1)
        if (index < 0)
            index = slides.length - 1
        else if (index === slides.length)
            index = 0
        cancel()
      }
      api.start(i => {
        if (i < index - 1 || i > index + 1) return { display: 'none' }
        const x = (i - index) * width + (active ? mx : 0)
        const scale = active ? 1 - Math.abs(mx) / width / 2 : 1
        return { x, scale, display: 'block' }
      })
    })

    // dynamic and button change
    document.body.addEventListener("changeSlideDisplayed", (e) => {
        index = index + e.detail
        
        if (index === slides.length)
            index = 0
        if (index < 0)
            index = slides.length - 1

        api.start(i => {
            const x = (i - index) * width + (i > index ? width : 0)
            const scale = 1
            return { x, scale, display: 'block' }
        })
    
        }, false);

    return (
      <div className="wrapper">
        {props.map(({ x, display, scale }, i) => (
          <animated.div className="page" {...bind()} key={i} style={{ display, x }}>
            <animated.div id={'picture' + i} style={{ scale, backgroundImage: "url('" + slides[i].picture + "')" }} />
          </animated.div>
        ))}
      </div>
    )
  }

const DisplayPage = () => {
    // use context(s)
    const { isConfigInitialized, config } = useContext(ConfigContext)
    // use state(s)
    const [isLoadHasBegin, setIsLoadHasBegin] = useState(false)
    const [isDisplayIsVisible, setIsDisplayIsVisible] = useState(false)

    // use effect(s)
    // timer next loads pictures
    useEffect(() => {
        const interval = setInterval(() => {
            loadCount = 0
            loadIndex = 0
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
        await delay((transitionDelay / 2) * 1000)
    }
  
    // transition second part
    const toWhite = async () => {
        document.body.style.transition = "opacity " + transitionDelay / 2 +"s"
        document.body.style.opacity = 1
        await delay((transitionDelay / 2) * 1000)
    }
    
    // load initials Slides
    const getInitialsSlides = async () => {
        // load picture
        console.log("Start loading")
        var rawSlides = []
    
        rawSlides = await slidesService.getAllToDisplay().catch(e => {
            console.log(e)
            alert("communication error with server, please reload")    
            return
        })

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
        loadIndex = 1
        loadCount = 0
        console.log("Finish loading")
        // display viewPager 
        await toBlack()
        setIsDisplayIsVisible(true)
        console.log('picture ' + index + ' displayed')
        await toWhite() 
        // begin endless picture display
        carousel()


    }

    const reloadSlidePicture = async () => {
        var newPicture = await picturesService.getOneBySlideId(slides[loadIndex].id)
        .catch(e => {
            console.log(e)
        })
        document.getElementById('picture' + loadIndex).style.backgroundImage = "url('" + newPicture + "')"
        console.log('picture ' + loadIndex + ' reloaded')
        loadIndex++
        loadCount++

        if (loadIndex === slides.length)
            loadIndex = 0
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
            if (loadCount <= slides.length)
            {
                // wait reload image and next transition
                await Promise.all([reloadSlidePicture(), delay(displayDelay)])
            } 
            else 
            {
                // wait next transition
                await delay(displayDelay)
            }
            // start first part transition  
            await toBlack()
            const changeSlideDisplayed = new CustomEvent("changeSlideDisplayed", { detail: 1 })
            document.body.dispatchEvent(changeSlideDisplayed)
            await delay(500)
            console.log('picture ' + index + ' displayed')
            // start second transition
            await toWhite()    
        }
    }

    const previous = () => {
        const changeSlideDisplayed = new CustomEvent("changeSlideDisplayed", { detail: -1 })
        document.body.dispatchEvent(changeSlideDisplayed)
       
    }

    const next = () => {
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
        await getInitialsSlides()

    }
    initSlideshow()

    return (
        <>
            { isDisplayIsVisible ?
                <>
                    <div className="flex fill center">
                        <Viewpager />
                        <div style={{ position: 'fixed', bottom: '2%', left: '1%'}}>
                            <Button style={{ display:'block', margin:2, height:35, width:80}} onClick={previous} >Previous</Button>
                            <Button style={{ margin:2, height:35, width:80}} onClick={next} >Next</Button>
                        </div> 
                        <div style={{ textAlign:'right', position: 'fixed', bottom: '2%', right: '1%'}}>
                            <Button style={{display:'block', height:35, width:80, margin:2}} onClick={previous} >Previous</Button>
                            <Button style={{ margin:2 , height:35, width:80 }} onClick={next} >Next</Button>
                        </div>
                    </div>
                    
                </>
            : <img id="img" style={{ display:'block', marginRight:'auto', marginLeft:'auto', marginTop:'15%', height:'40%'}} src={loadingGif} ></img> }
        </>
    )

}

export default DisplayPage