import React, {Component, useEffect, useState} from 'react';
import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import PasswordRecovery from "../pages/PasswordRecovery";
import News from "../pages/News";
import AddNews from "../pages/AddNews";
import Profile from "../pages/Profile";
import AddCampType from "../pages/AddCampType";
import Camps from "../pages/Camps";
import EditProfile from "../pages/EditProfile";
import AddSchedule from "../pages/AddSchedule";

const AppRouter = () => {


        return (
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/registration" element={<Registration/>}/>
                <Route path="/recovery" element={<PasswordRecovery/>}/>
                <Route path="/news/:id" element={<News/>}/>
                <Route path="/profile/:id" element={<Profile/>}/>
                <Route path="/editProfile/:id" element={<EditProfile/>}/>
                <Route path="/addNews" element={<AddNews/>}/>
                <Route path="/updateNews/:id" element={<AddNews/>}/>
                <Route path="/addCampType" element={<AddCampType/>}/>
                <Route path="/addSchedule/:id" element={<AddSchedule/>}/>
                <Route path="/updateCampType/:id" element={<AddCampType/>}/>
                <Route path="/camps" element={<Camps/>}/>
            </Routes>
        );

}

export default AppRouter;