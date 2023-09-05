import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import moment from "moment";
import { Button } from '@mui/material';
import axios from 'axios';



function PaymentDetails({selectedPlan}) {

    const stripe = useStripe();
    const elements = useElements();

    const navigate = useNavigate();

    useEffect(() => {
        if(selectedPlan.planName == undefined){
            navigate("/plans");
        }
    }, []);


    const startDate = moment().toDate();
    const endDate = moment(startDate)
    .add(1, selectedPlan.planType === "Monthly" ? "M" : "y")
    .toDate();

    const amount = selectedPlan.planType === "Monthly"
    ? selectedPlan.MonthlyPrice
    : selectedPlan.yearlyPrice;


    const createSubscription = async () => {
        if (!stripe || !elements) {
            console.log("Here")
          // Stripe.js hasn't yet loaded.
          // Make sure to disable form submission until Stripe.js has loaded.
          return;
        }
        // console.log("stripe is : ",stripe);
        // console.log("element is : ",elements);
        // console.log("Card Element is : ",CardElement);
        try {
          const paymentMethod = await stripe.createPaymentMethod({
            card: elements.getElement(CardElement),
            type: "card",
          });
          // console.log("Creeated Payment method while creating Subscription",paymentMethod);

          try {
              const sub = {
                name : localStorage.getItem("username"),
                email : localStorage.getItem("email"),
                paymentMethod: paymentMethod.paymentMethod.id,
                priceId: selectedPlan.priceId,
                // planType: localStorage.getItem("planType")
              }
              // console.log("These is the object which need to go in subscription ",sub);
            const response = await axios.post("http://localhost:8800/api/bills/subscribe",sub);

            if (!response.data.clientSecret) return alert("Payment unsuccessful!");
            const data = await response.data;
            const confirm = await stripe.confirmCardPayment(data.clientSecret);
            if (confirm.error) return alert("Payment unsuccessful!");

            // Updation in db as well as local storage
                 try {
                     await axios.post("http://localhost:8800/api/users/updateCurrentPlan", {
                     email : localStorage.getItem("email"),
                     planName : selectedPlan.planName,
                     subscriptionId : response.data.subscriptionId,
                     planType : selectedPlan.planType,
                   });
                    localStorage.setItem("cancelled", "false");
                    localStorage.setItem("subscriptionId", response.data.subscriptionId);
                    localStorage.setItem('current_plan',  selectedPlan.planName);
                    localStorage.setItem('planType', selectedPlan.planType);
                    const amount =  selectedPlan.planType === 'Monthly' ? 
                    selectedPlan.MonthlyPrice : selectedPlan.yearlyPrice;
                    localStorage.setItem('amount', amount);


                    navigate("/currentPlan");
                    alert("Payment Successful! Subscription active.");

                        // adding bill to db
                        const Bill = {
                          email : localStorage.getItem("email"),
                          amount: localStorage.getItem("amount"),
                          plan : selectedPlan.planName,
                          payment_id : paymentMethod.paymentMethod.id
                        }
                           try {
                             await axios.post("http://localhost:8800/api/bills/createBill",Bill);
                             console.log("Succefully posted Bill in database");
                           }catch(err) {
                             console.log("Couldn't post Bill",err);
                           }

                 } catch(err) {
                    console.log("Couldn't update current plan",err);
                 }

          } catch (err) {
            console.log("Couldn't post to subscribe",err);
          }
          
        } catch (err) {
          console.error(err);
          alert("Payment failed! " + err.message);
        }
      };

    return (
      <div className="w-1/2 flex flex-row">
        <div className="flex flex-col items-start flex-[1.2] bg-white px-8 py-8 rounded-tl-lg rounded-bl-lg">
          <h1 className="text-black text-3xl font-semibold">Complete Payment</h1>
          <div className="flex flex-row justify-center items-center">
            <h2 className="text-gray-600 text-xs">
              Enter your credit or debit card details below
            </h2>
          </div>
          
            <CardElement className="text-black w-full my-4 border-gray-400 border rounded-lg p-4" />
  
          <div className="w-1/2 mt-1">
            <Button variant="contained" size="small" 
            style={{"width" : "15em", "backgroundColor" : "#004e96", "height" : "3em"}} 
            onClick={() => createSubscription()}
            >Confirm Payment</Button>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-y-4 items-start px-8 py-8 bg-gray-50 rounded-tr-lg rounded-br-lg">
          <h1 className="text-black text-xl font-semibold">Order Summary</h1>
          <div className="flex justify-between items-center w-full text-black">
            <span>Plan Name</span>
            <b>{selectedPlan.planName}</b>
          </div>
          <hr className="w-full" />
          <div className="flex justify-between items-center w-full text-black">
            <span>Billing Cycle</span>
            <b>{selectedPlan.planType}</b>
          </div>
          <hr className="w-full" />
          <div className="flex justify-between items-center w-full text-black">
            <span>Plan Price</span>
            <b>
              {amount}
            </b>
          </div>
          <hr className="w-full" />
        </div>
      </div>
    );
}

export default PaymentDetails;


