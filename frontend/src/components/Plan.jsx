import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, Typography } from '@mui/material';
import ToggleSwitch from './ToggleSwitch'; 
import PlanCard from './PlanCard';
import Devices from './Devices'; 
import './plan.css';

function PlansComponent({setSelectedPlan}) {
    const [plans, setPlans] = useState([]);
    const [currentSelected, setCurrentSelected] = useState(0);
    const [planType, setPlanType] = useState('Monthly');
    const rowOptions = [
        planType === 'Monthly' ? 'Monthly price' : 'Yearly price',
        'Video quality',
        'Resolution',
        'Devices you can use to watch',
    ];

    const navigate = useNavigate();

    function handlePayment() {
        console.log('handlePayment called',currentSelected);
        const selectedPlan = plans[currentSelected];
        selectedPlan.planType = planType;
        selectedPlan.priceId =
            planType === 'Monthly' ? selectedPlan.mId : selectedPlan.yId;
        // const amount = 
        //     planType === 'Monthly' ? selectedPlan.MonthlyPrice : selectedPlan.yearlyPrice;
        setSelectedPlan(selectedPlan);
        // console.log("Selected plan is ", selectedPlan);
        // localStorage.setItem('current_plan',  selectedPlan.planName);
        // localStorage.setItem('planType', planType);
        // localStorage.setItem('amount', amount);
       
        navigate('/payment');
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:8800/api/bills/plans');
                console.log("after fetching ",response.data);
                setPlans(response.data.plans);
            } catch (error) {
                console.error('Error fetching plans:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="Container">
            <div className="PContainer">
            <Typography
                variant="h6"
                component="div"
                className="text-center"
                style={{ marginTop: '2em', marginBottom: '1em' }}
            >
                Choose the right plan for you
            </Typography>
            <div className="planContainer">
                <TableContainer style={{ width: '60em' }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={
                                    { paddingRight: '2em',
                                    //   border: "1px solid red",
                                    }
                                    }>
                                    <ToggleSwitch
                                        setPlanType={setPlanType}
                                        planType={planType}
                                    />
                                </TableCell>
                                {plans.map((plan, i) => (
                                    <TableCell key={i}>
                                        <PlanCard
                                            key={i}
                                            planName={plan.planName}
                                            id={i}
                                            currentSelected={currentSelected}
                                            setCurrentSelected={setCurrentSelected}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rowOptions.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell>{row}</TableCell>
                                    {i === 0
                                        ? plans.map((plan, j) => (
                                              <TableCell
                                                  align="center"
                                                  key={j}
                                                  sx={
                                                      j !== currentSelected
                                                          ? {}
                                                          : {
                                                                color:
                                                                    '#004e96',
                                                            }
                                                  }
                                              >
                                                  {planType === 'Monthly'
                                                      ? plan.MonthlyPrice
                                                      : plan.yearlyPrice}
                                              </TableCell>
                                          ))
                                        : null}
                                    {i === 1
                                        ? plans.map((plan, j) => (
                                              <TableCell
                                                  align="center"
                                                  key={j}
                                                  sx={
                                                      j !== currentSelected
                                                          ? {}
                                                          : {
                                                                color:
                                                                    '#004e96',
                                                            }
                                                  }
                                              >
                                                  {plan.videoQuality}
                                              </TableCell>
                                          ))
                                        : null}
                                    {i === 2
                                        ? plans.map((plan, j) => (
                                              <TableCell
                                                  align="center"
                                                  key={j}
                                                  sx={
                                                      j !== currentSelected
                                                          ? {}
                                                          : {
                                                                color:
                                                                    '#004e96',
                                                            }
                                                  }
                                              >
                                                  {plan.Resolution}
                                              </TableCell>
                                          ))
                                        : null}
                                    {i === 3
                                        ? plans.map((plan, j) => (
                                              <TableCell
                                                  align="center"
                                                  key={j}
                                                  sx={
                                                      j !== currentSelected
                                                          ? {}
                                                          : {
                                                                color:
                                                                    '#004e96',
                                                            }
                                                  }
                                              >
                                                  <Devices devices={plan.devices} />
                                              </TableCell>
                                          ))
                                        : null}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Button
                variant="contained"
                size="large"
                style={{
                    width: '20em',
                    backgroundColor: '#004e96',
                    marginTop: "1.5em"
                }}
                onClick={handlePayment}
            >
                Next
            </Button>
        </div>
        </div>
    );
}

export default PlansComponent;
