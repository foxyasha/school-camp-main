import React, {Component} from 'react';
import Toastify from "toastify-js";

function ValidData(message, bool){
    if (bool){
        Toastify({
            text: message,
            gravity: "bottom",
            position: "right",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                borderRadius: "5px"
            }
        }).showToast();
    }
    else{
        Toastify({
            text: message,
            gravity: "bottom",
            position: "right",
            style: {
                background: "linear-gradient(to right, #fe4848, #cb0b34)",
                borderRadius: "5px"
            }
        }).showToast();
    }
}

export default ValidData;