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

    useEffect(() => {
        fetch('http://localhost:8000/banner')
            .then(response => response.json())
            .then(data => {
                console.log(data);
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
        console.log(isVisible)
    }, [isVisible]);

    const updateBannerSettings = (newSettings) => {
        setBannerSettings(prevSettings => ({
            ...prevSettings,
            ...newSettings,
        }));

        fetch('http://localhost:8000/banner', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSettings),
        })
            .then(response => response.text())
            .then(message => console.log(message))
            .catch(error => console.error('Error updating banner data:', error));
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
                        />
                    }
                />
                <Route
                    path="/dashboard"
                    element={<Dashboard updateBannerSettings={updateBannerSettings} isVisible={isVisible} setIsVisible={setIsVisible} />}
                />
            </Routes>
        </Router>
    );
};

export default App;
