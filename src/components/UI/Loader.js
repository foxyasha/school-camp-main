import React, {Component} from 'react';
import {Spinner} from "react-bootstrap";

class Loader extends Component {
    render() {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                justifyContent:"center",
                alignItems: "center",
                display:"flex",
            }}>
                <Spinner style={{
                    width: '50px',
                    height: '50px',
                }}/>
            </div>
        );
    }
}

export default Loader;