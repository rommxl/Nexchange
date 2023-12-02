import React, { useState } from "react";
import axios from "axios";
import ResultSection from "./resultsection";

const link = "http://127.0.0.1:8000/prediction";

function InputArea(){

    const [prediction,setPrediction] = useState({'price':['abc']})
    const [resultStatus,setResultStatus] = useState("none")
    const [convToFrom,setConvToFrom] = useState(['',''])

    function fetchprediction(event){
        const from = event.target[0].value;
        const to = event.target[1].value;

        axios
        .post(`${link}`,{
            from:from,
            to:to
        })
        .then((response) => {
            // console.log(response.data);
            setPrediction(response.data);
            setResultStatus("flex");
            setConvToFrom([response.data.conv_from,response.data.conv_to])
        });
        
        event.preventDefault();
    }

    return(
        <div className="flex-column">
            <div className="inputarea-container">
                <div className="inputarea">
                    <form onSubmit={fetchprediction} method="post" className="form">
                        <div style={{display:"flex", justifyContent:"space-evenly"}}>
                            <div className="inputsquare">
                                <div className="form-group mx-sm-3 mb-2">
                                    <input type="text" className="form-control" name="from" placeholder="FROM" style={{textAlign:"center"}}/>
                                </div>
                            </div>
                            
                            <div className="inputsquare">
                                <div className="form-group mx-sm-3 mb-2">
                                    <input type="text" className="form-control" name="to" placeholder="TO" style={{textAlign:"center"}}/>
                                </div>
                            </div>
                        </div>
                        <div className="form">
                            <div className="hori-centre">
                                <button type="submit" className="btn btn-primary mb-2">Predict</button>
                            </div>
                        </div>  
                    </form>
                </div>  
            </div>
            <div className="hori-centre">
                <div className="flex-column">
                    <div className="hori-centre">
                        <h1 style={{textAlign:"center", display:resultStatus, maxWidth:"max-content"}}>Next 10 weeks prediction</h1>
                    </div>
                    <ResultSection 
                            prices={prediction['price']} 
                            lastDate={prediction['last_date']} 
                            status={resultStatus}
                            convFrom={prediction['conv_from']}
                            convTo={prediction['conv_to']}
                            pred_len={prediction['pred_len']}
                        />
                </div>
            </div>
        </div>
    )
}

export default InputArea;