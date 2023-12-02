import React from "react";
import { Line } from "react-chartjs-2";
import {addDays} from 'date-fns'

function ResultSection(props){

    const prices = props.prices.map(str => parseFloat(str));
    var dateArray = []
    var graph = {}
    if(props.status === "flex")
    {
        const [year,month,day] = String(props.lastDate).split('-');
        const currDate = new Date(year,month-1,day);
        const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

        for (let index = 0; index < props.pred_len+1; index++) {

            const futDate = addDays(currDate,7*index)
            dateArray.push(
                String(futDate.getDate()) + ' ' + 
                months[futDate.getMonth()] + ' ' + 
                String(futDate.getFullYear())
            );
        }

        graph = {
            labels: dateArray,
            datasets : [
                {
                    label: `${props.convFrom} to ${props.convTo}`, // Setting up the label for the dataset
                    backgroundColor: "rgb(11, 11, 68)", // Setting up the background color for the dataset
                    borderColor: "rgb(255, 99, 132)", // Setting up the border color for the dataset
                    data: prices, // Setting up the data for the dataset
                }
            ]
        }
    }
    

    return (
        <div className="hori-centre resultsection graph" style={{display:props.status}}>
            {props.status === "flex"?<Line data={graph}/>: null}
        </div>
    )
}

export default ResultSection;