import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Moment from "react-moment";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CurrentPlan({plan}) {
    
    const navigate = useNavigate();

    const [active, setActive] = useState(true);
    const [planType, setPlanType] = useState("Monthly");
    
    useEffect(()=>{
        console.log("plan inside Current plan", plan);
        if(plan?.planName == null){
            navigate("/plan")
        }
        // console.log(localStorage.getItem("cancelled"));
        setActive(localStorage.getItem("cancelled") == "false" ? true : false);
        setPlanType(plan.planType == undefined ? localStorage.getItem("planType") : plan.planType);
    }, []);

    const printing = () => {
        navigate("/plan")
        // console.log("plan", plan);
        console.log(new Date().addMonths(1));
    }

    async function cancelSubs() {
        await axios.post("http://localhost:8800/api/bills/cancel", {
            subscriptionId: localStorage.getItem("subscriptionId"),
            email : localStorage.getItem("email"),
        }).then(() => {
            localStorage.removeItem("subscriptionId");
            localStorage.removeItem("current_plan");
            localStorage.removeItem("planType");
            localStorage.removeItem("amount");
            localStorage.setItem("cancelled", "true");
            setActive(false);
        });
    }


    return (
        <div className='w-1/3 bg-white rounded-lg h-10em px-4'>
            <div className="flex w-full justify-between items-center">
                <div className="flex g-8">
                    <h1 className="text-black text-2xl font-semibold">
                        Current Plan Details
                    </h1>
                    {(active) ?
                        <ActiveTag label="Active" 
                        className="bg-blue-100 text-lucidean" 
                        style={
                            {
                               "margin":"10em"
                            }}
                        /> :
                        <ActiveTag label="Cancelled" 
                        className="bg-red-50 text-red-400" 
                        style={
                            {
                                "margin":"10em"
                            }}
                        />
                    }
                </div>
                {active ? (
                    <>
                        <button
                            onClick={() => cancelSubs()}
                            className="text-lucidean font-semibold bg-seasalt bg-opacity-0 hover:bg-opacity-70 transition-all duration-300 p-2 rounded-lg"
                            data-modal-toggle="popup-modal"
                            type="button"
                        >
                            Cancel
                        </button>
                    </>
                ) : null}
            </div>
            <div className="flex flex-col">
                <h2 className="text-lg text-black font-semibold">{plan?.planName}</h2>
                <h3 className="text-base text-black">{plan?.devices?.join("+")}</h3>
            </div>

            <div>
                <b className="text-3xl text-black font-bold">
                {   planType === "Monthly"
                    ? plan?.MonthlyPrice?.toString()
                    : plan?.yearlyPrice?.toString()}

                </b>
                <span className="text-black text-lg font-semibold">
                </span>
            </div>
            <Button size="small" 
            style={
                {
                   "width" : "10em", 
                   "border" : "2px solid rgb(31, 77, 145)", 
                   "height" : "3em", 
                   "color" : "rgb(31, 77, 145)"
                }} 
            onClick={() => printing()}>
                {active ? "Change" : "Choose"}

                {" Plan"}
            </Button>
            <div className="w-full bg-seasalt bg-opacity-40 rounded-lg p-2 text-black font-normal shadow-gray-400">
                {active ? (
                    <p>
                        Your subscription has started on{" "}
                        <Moment
                              date={new Date()}
                            format="MMM Do, YYYY"
                            className="font-semibold"
                        ></Moment>{" "}
                        and will auto renew on{" "}
                        <Moment
                              date={planType == "Monthly" ? new Date().addMonths(1) : new Date().addMonths(12)}
                            format="MMM Do, YYYY"
                            className="font-semibold"
                            add={{ days: 1 }}
                        ></Moment>
                    </p>
                ) : (
                    <p>
                        Your subscription was cancelled and you will lose access to services
                        on{" "}
                        <Moment
                              date={planType == "Monthly" ? new Date().addMonths(1) : new Date().addMonths(12)}
                            format="MMM Do, YYYY"
                            className="font-semibold"
                        ></Moment>
                    </p>
                )}
            </div>
        </div>
    )
}


function ActiveTag({ label, className }) {
    return (
        <div
            className={[
                "text-center rounded-md px-2 py-1 text-sm font-medium tracking-wider",
                className,
            ].join("   ")}
        >
            {label}
        </div>
    );
}

