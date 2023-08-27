import React from 'react';
import "./plancard.css";

function PlanCard({ planName, id, setCurrentSelected, currentSelected }) {
    return (
        <div className="cardContainer">
            <div 
            className={id === currentSelected ? "card-selected" : "card-unselected"} 
            onClick={() => setCurrentSelected(id)}
            >
                <div className="card-text">{planName}</div>
            </div>
            {id === currentSelected ? 
            <div className="arrow"></div> : <></>}
        </div>
    );
}

export default PlanCard;
