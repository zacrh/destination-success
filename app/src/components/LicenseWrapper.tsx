import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabase';
import "./Counter.css";
import "./LicenseWrapper.css";

export default function LicenseWrapper({ children }) {
    // Initialize device & license key
  let [deviceData, setDeviceData] = useState(null);
  let [deviceId, setDeviceId] = useState(localStorage.getItem('deviceId') || uuidv4());
  let [licenseKey, setLicenseKey] = useState('');
  let [isValid, setIsValid] = useState(false);
  let [invalidKeys, setInvalidKeys] = useState([]);
  let [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setLicenseKey(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const { data, error: licenseError } = await supabase
        .from('licenses')
        .select('license_key, device')
        .eq('license_key', licenseKey)
        .or(`device.eq.${deviceId},device.is.null`)
        .single()
        if (licenseError) {
            console.error(licenseError)
            return
        }
    
    if (!data) {
        console.error("Invalid license key")
        setInvalidKeys([...invalidKeys, licenseKey]);
        return
    }
    
    console.log(data);
    if (data.device !== null && data.device === deviceId) {
        console.log("License key activated on this device in the past. Logging in...")
        localStorage.setItem('licenseKey', data.license_key);
        setIsValid(true);
        return
    }

    // Update info about the device
    const { data: devicesData, error: deviceError } = await supabase
        .from('devices')
        .select('device_id')
        .eq('device_id', deviceId)
        .single()
    if (deviceError) {
        console.error(deviceError)
        if (deviceError.details.includes('The result contains 0 rows')) {
            console.log('yoooo')
            const { error: createDeviceError } = await supabase
                .from('devices')
                .insert({
                    device_id: deviceId,
                    device: deviceData.userAgent,
                })
            if (createDeviceError) {
                console.error(createDeviceError)
                return
            }
        }
    }
    console.log(devicesData);

    // Activate the fresh license key
    const { error: activateLicenseError } = await supabase
        .from('licenses')
        .update({
            device: deviceId,
            activated_at: new Date().toISOString(),
            ip_address: deviceData.IP,
        })
        .eq('license_key', licenseKey)
    if (activateLicenseError) {
        console.error(activateLicenseError)
        return
    }
    console.log(`License key activated: ${licenseKey}`);
    localStorage.setItem('licenseKey', licenseKey);

    setIsLoading(false);
    setIsValid(true);
  };

  // Get device data
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const deviceData = {
        userAgent,
        IP: '',
    };
    setDeviceData(deviceData);
    console.log(deviceData);

    axios.get('https://ipv4.seeip.org/jsonip')
      .then((response) => {
        const newDeviceData = {
          ...deviceData,
          IP: response.data.ip,
        };
        console.log(newDeviceData);
        setDeviceData(newDeviceData);
      })
      .catch((error) => {
        // handle error
      });

    let storedDeviceId = localStorage.getItem('deviceId');
    if (!storedDeviceId) {
        storedDeviceId = uuidv4();
        localStorage.setItem('deviceId', storedDeviceId);
    }
    setDeviceId(storedDeviceId);

    if (localStorage.getItem('licenseKey')) {
        setLicenseKey(localStorage.getItem('licenseKey'));
        setIsValid(true);
    }
  
  }, []);


  // let deviceId = localStorage.getItem('deviceId');
  // if (!deviceId) {
  //   // deviceId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  //   deviceId = uuidv4(); // generate a new uuid if none was stored
  //   localStorage.setItem('deviceId', deviceId);
  // }

  return (
    <>
        {!isValid ? (
            <div className="license">
                <h2 className="header">Welcome!</h2>
                <h4 className="sub">Please enter your key to start collecting feedback</h4>
                <form onSubmit={handleSubmit} className={`license-form`}>
                    <input 
                        id="licenseKey"
                        type="licenseKey" 
                        value={licenseKey}
                        onChange={handleChange} 
                        placeholder='Enter your activation key'
                        className="license-input"
                    />
                    <button type="submit" className={`license-button ${licenseKey.length === 36 ? 'eligible' : 'ineligible'}`}>Activate</button>
                </form>
            </div>
        ) : (
            <>{
                children
            }</>
        )}
        
    </>
  )
}