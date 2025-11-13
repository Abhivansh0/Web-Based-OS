import React from 'react'
import '../errorBox/ErrorBox.css'
import { RiHeartFill } from "@remixicon/react";


const ErrorBox = ({errorName, isError}) => {

  let errorMSG = ''

  if (errorName === "OUT_OF_MEMORY") errorMSG = "ri-ram-2-line";
  else if (errorName === "CPU_OVERLOAD") errorMSG = "ri-cpu-line"
  return (
    <>
    <div className="error-page">
        <div className="error-box">
            <div className="errorImg">
                <i className={errorMSG}></i>
            </div>
            <div className="error-name">
            <p>{errorName}</p>
            <button onClick={()=>isError()} className='cursor-target'>OK</button>
            </div>
        </div>

    </div>
    </>
  )
}

export default ErrorBox
