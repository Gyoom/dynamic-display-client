// npm packag(s)
import React,{ useState, useEffect, useContext } from "react"
import { Layout, Card, Button, InputNumber } from 'antd'
// local file(s)
import loadingGif from "../../Assets/loading/loading.gif"
// react service(s)
import picturesService from "services/pictures"
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
var time = false
var displayDelay = 10 * 1000
var reloadDelay = 20 * 60 * 1000
var transitionPeriod = 2
var pictures = []
var picturesIndex = 0
var activesLoop = 0

const DisplayPage = () => {
    // use context(s)
    const { isConfigInitialized, config } = useContext(ConfigContext)
    // use state(s)
    const [displayIsActive, setDisplayIsActive] = useState(false)
    const [loopIsActive, setLoopIsActive] = useState(false)
    const [stopDisplay, setStopDispay] = useState(false)

    // use effect(s)
    // timer next load pictures
    useEffect(() => {
        const interval = setInterval(() => {
            time = true
        }, reloadDelay)

        return () => clearInterval(interval)
    }, [])

    // init the config
    useEffect(() => {
        if (isConfigInitialized)
        {
            displayDelay = config.displayDelay * 1000
            reloadDelay = config.reloadDelay * 60 * 1000
        }
    }, [isConfigInitialized])

    // functions
    // delay function
    const delay = ms => new Promise(res => setTimeout(res, ms))
    
    // transition first part
    const toBlack = async () => {
        document.body.style.transition = "opacity " + transitionPeriod / 2 +"s"
        document.body.style.opacity = 0
        await delay((transitionPeriod / 2) * 1000)
    }
  
    // transition second part
    const toWhite = async () => {
        document.body.style.transition = "opacity " + transitionPeriod / 2 +"s"
        document.body.style.opacity = 1
        await delay((transitionPeriod / 2) * 1000)
    }

    const displaySlide = (direction) => {
        console.log("slide " + picturesIndex + " is displayed")

        if (!direction)
        {
            picturesIndex = picturesIndex - 2
            if (picturesIndex === -1)
                picturesIndex = pictures.length - 1
            else if (picturesIndex === -2)
                picturesIndex = pictures.length - 2
        }

        document.getElementById('img').setAttribute('src', pictures[picturesIndex])
        
        if (picturesIndex === pictures.length - 1)
            picturesIndex = 0
        else
            picturesIndex++
    }
    
    // load picture
    const getPictures = async () => {
        // load picture
        console.log("Start loading")
        var rawPictures = []
        picturesIndex = 0
        var screenResolution = {
            height: 900,
            width: 1920,
        }
        rawPictures = await picturesService.getAll(screenResolution).catch(e =>
            {
                console.log(e)
                alert("communication error with server, please reload")    
                return
            })
        console.log("Finish loading")

        // check if available picture exist
        if (rawPictures.length === 0 || rawPictures.find(s => s !== null && !s.startsWith('404')) == undefined)
        {
            setStopDispay(true)
            alert("No available images")
            document.getElementById('img').remove();
            return
        }

        pictures = []
        rawPictures.forEach(rawPicture => {
            if(rawPicture !== null && !rawPicture.startsWith('404'))
            {
                pictures.push(rawPicture)
            }
        })

        // start first part transition   
        await toBlack()
        // display first picture
        setLoopIsActive(true)
        document.getElementById('img').style = {}
        document.getElementById('img').style.height = '100%'
        document.getElementById('img').style.width = '100%'
        displaySlide(true)

        // start second transition
        await toWhite() 

        // begin endless picture display
        carousel()

    }

    const carousel = async () => {
        activesLoop++
        while (true)
        {   
            // check time to load picture
            if (time)
            {
                await getPictures()
                time = false
            }

            // wait next transition
            await delay(displayDelay)
            // check actives loops
            if (activesLoop > 1)
            {
                activesLoop--
                return
            }
            
            // start first part transition   
            await toBlack()

             // check actives loops
             if (activesLoop > 1)
             {
                 activesLoop--
                 return
             }

            // display next available picture
            displaySlide(true)

             // check actives loops
             if (activesLoop > 1)
             {
                 activesLoop--
                 return
             }

            // start second transition
            await toWhite()  

             // check actives loops
             if (activesLoop > 1)
             {
                 activesLoop--
                 return
             }
    
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
            { loopIsActive ?
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