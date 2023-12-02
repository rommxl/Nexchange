import React from "react";

function ResultSection(props){
    
    return (
        <div className="hori-centre resultsection" style={{display:props.status}}>
            <h1>
                {props.prices}
            </h1>
        </div>
    )
}

export default ResultSection;