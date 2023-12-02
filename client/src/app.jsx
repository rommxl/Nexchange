import React from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Landingpage from "./pages/landingpage";


function App(){


    return(
        <div>
            <Router>
                <Routes>    
                    <Route path="/" element={ <Landingpage/> }/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;