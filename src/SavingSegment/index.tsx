import React, { useEffect, useState } from 'react'
import classes from './style.module.css'
import SegmentPopup from './SegmentPopup'


var isMount = true

export default function Segment(){

    const [isOpenPopup,setisOpenPopup] = useState<boolean>(false)


useEffect(() => {
    isMount = true
    return ()=> {
        isMount=false
    }
},[])

    return (
        <div className={classes.container}>
            {isOpenPopup && <SegmentPopup isVisible={isOpenPopup} onClose={() => {
                setisOpenPopup(false)
            }} />}
            <button className={classes.saveSegmentBtn} onClick={() => {
                if(isMount){
                    setisOpenPopup(true)
                }
            }}>Save Segment</button>
        </div>
    )
}