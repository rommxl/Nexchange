import React from "react";
import logo from "../static/imgs/logo.png"
function Navbar(){

    return(
        <div className="navbar nomarginpadding">
            <div style={{height:"100%"}}>
                <img src={logo} alt="" className="nomarginpadding img" style={{height:"100%"}}/>
            </div>
            <div className="navbarButtons">
                <div className="navbuttons">
                    <a href="#" className="btn btn-primary btn-lg button" role="button" >About</a>
                    <a href="#" className="btn btn-primary btn-lg button" role="button" >Contact</a>
                </div>
            </div>
        </div>
    )
}

export default Navbar;