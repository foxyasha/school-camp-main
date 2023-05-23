import React, {Component} from 'react';
import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import PasswordRecovery from "../pages/PasswordRecovery";

class AppRouter extends Component {
    render() {
        return (
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/recovery" element={<PasswordRecovery/>}/>

            </Routes>
        );
    }
}

export default AppRouter;