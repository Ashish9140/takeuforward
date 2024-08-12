// App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Banner from './components/Banner';
import Dashboard from './components/Dashboard';

const App = () => {
    const [bannerSettings, setBannerSettings] = useState({
        description: '',
        timer: 0,
        link: ''
    });
    const [isVisible, setIsVisible] = useState(true);
    const [loading, setLoading] = useState(false); // Add loading state here

    useEffect(() => {
        fetch('https://takeuforward-7mh2.onrender.com/banner')
            .then(response => response.json())
            .then(data => {
                setBannerSettings({
                    description: data.description,
                    timer: data.timer,
                    link: data.link
                });
            })
            .catch(error => console.error('Error fetching banner data:', error));
    }, []);

    useEffect(() => {
        const savedVisibility = localStorage.getItem('bannerVisibility');
        if (savedVisibility !== null) {
            setIsVisible(JSON.parse(savedVisibility));
        } else {
            localStorage.setItem('bannerVisibility', JSON.stringify(true));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('bannerVisibility', JSON.stringify(isVisible));
        console.log(isVisible);
    }, [isVisible]);

    const updateBannerSettings = async (newSettings) => {
        setLoading(true); // Set loading to true when starting the update
        try {
            const response = await fetch('https://takeuforward-7mh2.onrender.com/banner', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSettings),
            });

            if (!response.ok) {
                throw new Error('Failed to update banner data');
            }

            const message = await response.text();
            console.log(message);
            setBannerSettings(prevSettings => ({
                ...prevSettings,
                ...newSettings,
            }));
        } catch (error) {
            console.error('Error updating banner data:', error);
        } finally {
            setLoading(false); // Set loading to false after the update is complete
        }
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Banner
                            bannerSettings={bannerSettings}
                            setBannerSettings={setBannerSettings}
                            isVisible={isVisible}
                            setIsVisible={setIsVisible}
                            loading={loading} // Pass loading state to Banner
                        />
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <Dashboard 
                            updateBannerSettings={updateBannerSettings} 
                            isVisible={isVisible} 
                            setIsVisible={setIsVisible} 
                            loading={loading} // Pass loading state to Dashboard
                        />
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
