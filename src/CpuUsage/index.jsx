import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts"

const serverUrl = "localhost:3000";

function CpuUsage() {
    const [TimePeriod, setTimePeriod] = useState(1);
    const [period, setPeriod] = useState('');
    const [ip, setIp] = useState("");
    const [error, setError] = useState("");
    const [data, setData] = useState({ Timestamps: [], Values: [] });
    const [formattedData, setFormattedData] = useState([{}]);

   useEffect(() => {
        const formatted = data.Timestamps.map((timestamp, index) => ({
            timestamp: new Date(timestamp),
            value: data.Values[index],
        }));

        if (formatted.length > 1) {
            setFormattedData(formatted);
        }
    }, [data]);


    const getData = async () => {
        const res = await axios.get(`http://${serverUrl}/cpu-usage?ipAddress=${ip}&periodDays=${TimePeriod}&period=${period}`)
        setData(res.data);
    }


    const validateIP = () => {

        const ipPattern =/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (!ipPattern.test(ip))
            setError("Invalid IP address.");
        else
            setError("");
    }

    const validatePeriod = () => {
        if (period % 60 !== 0)
            setError("Invalid Period, It must be a multiple of 60");
        else
            setError("");
    }

    const handleSubmit = () => {
        validateIP()
        validatePeriod()
        getData()
    }


    return (

        <div style={{ border: '2px solid black', padding: '20px', margin: '20px' }}>
            <h1>AWS Instance CPU Usage</h1>

            <FormControl fullWidth >
                <InputLabel id="TimePeriod" >Time Period</InputLabel>
                <Select
                    label="TimePeriod"
                    labelId='TimePeriod'
                    id='Time'
                    value={TimePeriod}
                    onChange={(e)=>{setTimePeriod(e.target.value)}}
                >
                    <MenuItem value={1} >Last Day</MenuItem>
                    <MenuItem value={2}>Two Days Ago</MenuItem>
                    <MenuItem value={3}>Three Days Ago</MenuItem>
                    <MenuItem value={7}>Last Week</MenuItem>
                    <MenuItem value={14}>Two Weeks Ago</MenuItem>
                </Select>
            </FormControl>

            <br />
            <br />

            <TextField id='period' label="period" variant="outlined" required type='number'
                onChange={(e) => { setPeriod(+e.target.value) }} />

            <TextField id="ip" label="ip" variant="outlined" required placeholder="192.168.0.1"
                onChange={(e) => { setIp(e.target.value) }} />

            {error && <p style={{ color: "red" }}>{error}</p>}
            <br />
            <br />
            <Button onClick={handleSubmit} variant="outlined">View</Button>

            <LineChart width={900} height={250} data={formattedData} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                dataKey="timestamp"
                type="Date"
                domain={['auto', 'auto']}
                tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}
               />
                <YAxis 
                />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
        </div>
    )
}

export default CpuUsage;







