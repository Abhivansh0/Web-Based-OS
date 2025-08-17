import React, { useRef } from 'react'
import '../bootScreen/boot.css'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CSSPlugin } from "gsap/CSSPlugin";
import LetterGlitch from './GlassSurface';
import Squares from './Squares';

gsap.registerPlugin(CSSPlugin);


const BootScreen = ({ setBootScreen }) => {

    function breakText(selector, spacing) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(h1 => {
            const h1Text = h1.textContent;
            const splitText = h1Text.split(spacing);
            let clutter = "";

            splitText.forEach(char => {
                clutter += `<span>${char}</span>`;
            });

            h1.innerHTML = clutter;
        });
    }

    useGSAP(() => {
        breakText(".loading h1", "")
    })

    const upRef = useRef()
    const downRef = useRef()
    const breakRef = useRef()


    useGSAP(() => {
        const tl = gsap.timeline({
             delay: 1,
             onComplete:()=>{setBootScreen(false)}
             })
        tl.to(".up span", {
            // delay: 1,
            y: "-100%",
            stagger: 0.25,
            duration: 0.5,
            repeat: 3
        })
        tl.to(".down span", {
            // delay: 1,
            y: "-100%",
            stagger: 0.25,
            duration: 0.5,
            repeat: 3
        }, "0.01")
        tl.to(".load span", {
            opacity: 0,
            stagger: 0.08,
            duration: 1
        })
        tl.to(".welcome span", {
            delay: 0.5,
            opacity: 1,
            stagger: 0.08,
            duration: 1
        }, "<")
        tl.to(".boot-layer-box", {
            opacity:1,
            stagger:0.1,
            duration:0.4
        })
        tl.to(".boot-layer-box", {
            opacity:0,
            stagger:0.1,
            duration:0.4,
            // reversed:true
        }, '-=0.6')
        tl.to(".boot-container", {
            opacity:0
        }, '<')

    })





    return (
        <>
        <div className="boot-layer">
            <div className="boot-layer-box"></div>
            <div className="boot-layer-box"></div>
            <div className="boot-layer-box"></div>
            <div className="boot-layer-box"></div>
            <div className="boot-layer-box"></div>
            <div className="boot-layer-box"></div>
            <div className="boot-layer-box"></div>
            <div className="boot-layer-box"></div>
            <div className="boot-layer-box"></div>
            <div className="boot-layer-box"></div>
            <div className="boot-layer-box"></div>
            <div className="boot-layer-box"></div>
        </div>
            <div className="boot-container">
                <div ref={upRef} className="boot-screen-up">
                    <Squares
                        speed={0.5}
                        squareSize={50}
                        direction='diagonal' // up, down, left, right, diagonal
                        borderColor='#7FA0AB'
                        hoverFillColor='#7FA0AB'
                    />
                </div>
                <div ref={downRef} className="boot-screen-down">
                    <Squares
                        speed={0.5}
                        squareSize={50}
                        direction='diagonal' // up, down, left, right, diagonal
                        borderColor='#7FA0AB'
                        hoverFillColor='#7FA0AB'
                    />
                </div>
                <div className="loading">
                    <h1 className='load up' ref={breakRef} >LOADING</h1>
                    <h1 className='welcome'>WELCOME</h1>
                    <h1 className='load down' ref={breakRef} >LOADING</h1>
                </div>

            </div>
        </>
    )
}

export default BootScreen
