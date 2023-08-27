import React from 'react';
import "./devices.css";

function Devices({ devices }) {
    return (
        <div className="deviceContainer">
            {devices.map((device, i) => (
                <div key={i}>{device}</div>
            ))}
        </div>
    );
}

export default Devices;
