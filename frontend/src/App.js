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
    const [loading, setLoading] = useState(false);

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
            setIsVisible(true); // Set to true if there's no saved value
            localStorage.setItem('bannerVisibility', JSON.stringify(true)); // Save the default value
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('bannerVisibility', JSON.stringify(isVisible));
        console.log(isVisible);
    }, [isVisible]);

    const updateBannerSettings = async (newSettings) => {
        setLoading(true);
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
            setLoading(false);
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
                            loading={loading} 
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
                            loading={loading} 
                        />
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
