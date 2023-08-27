import React from 'react';
import "./toggleSwitch.css";

function ToggleSwitch({ setPlanType, planType }) {
    function handleToggleChange(event) {
        const newPlanType = event.target.value;
        setPlanType(newPlanType);
    }

    return (
        <div className="switches-container">
            <input
                type="radio"
                id="switchMonthly"
                name="switchPlan"
                value="Monthly"
                checked={planType === 'Monthly'}
                onChange={handleToggleChange}
            />
            <input
                type="radio"
                id="switchYearly"
                name="switchPlan"
                value="Yearly"
                checked={planType === 'Yearly'}
                onChange={handleToggleChange}
            />

            <label htmlFor="switchMonthly">Monthly</label>
            <label htmlFor="switchYearly">Yearly</label>
            <div className="switch-wrapper">
                <div className="switch">
                    <div>Monthly</div>
                    <div>Yearly</div>
                </div>
            </div>
        </div>
    );
}

export default ToggleSwitch;
