import React,{ useEffect, useState } from "react";
import loadingGif from "../../Assets/loading/loading.gif"
import screenshots from "services/screenshots"; 

const DisplayPage = () => {

    const UPDATE_DISPLAY_DELAY = 10000;
    var pictureArray = []
    var pictureIndex = 0

    const toBlack = () => {
        document.body.style.transition = "opacity 3s"
        document.body.style.opacity = 0
    }
  
    const toWhite = () => {
        document.body.style.transition = "opacity 3s"
        document.body.style.opacity = 1
    }

    const delay = ms => new Promise(res => setTimeout(res, ms))

    const getScreenshot = async () => {
        //const baseUrl = "http://localhost:4000/screenshots"
        // const request = axios.get(baseUrl)
        // pictureArray = []
        // await request
        //     .then(res => {
        //             for (let index = 0; index < res.data.length; index++) {
        //                 pictureArray.push(res.data[index]) 
        //             }
        //         }
        //     )
        console.log("Start loading")
        pictureArray = []
        pictureArray = await screenshots.getAll()
        console.log("Finish loading")

        document.getElementById('img').style.height = "100%"
        document.getElementById('img').style.width = "100%"
        document.getElementById('img').setAttribute('src', "data:image/png;base64, " + pictureArray[pictureIndex]);
        pictureIndex++;
        console.log("loaded")
    }

    const getLocalPicture = () => {

    }

    const displaySlideshow = async () => {
        while (true)
        {
            await delay(UPDATE_DISPLAY_DELAY)
            
            if (pictureArray.length > 0)
            {
                toBlack()
                await delay(3000)
                //changeBackground("data:image/png;base64," + pictureArray[pictureIndex])
                document.getElementById('img').setAttribute('src', "data:image/png;base64, " + pictureArray[pictureIndex]);
                toWhite()
                await delay(3000)
                
                if (pictureIndex === pictureArray.length - 1)
                    pictureIndex = 0
                else
                    pictureIndex++
            }
        }
    }

    const initSlideshow = async () => {
        if (pictureArray.length === 0)
        {
            await getScreenshot()
            await getLocalPicture()
            displaySlideshow()
        }

    }

    initSlideshow()

    return (
        <>
            <img id="img" style={{ display: "block", margin: "auto"}} src={loadingGif} ></img>
        </>
    )

}

export default DisplayPage