import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Banner = ({ bannerSettings, setBannerSettings, isVisible, setIsVisible }) => {
    const calculateTimeLeft = (timer) => {
        const days = Math.floor(timer / (3600 * 24));
        const hours = Math.floor((timer % (3600 * 24)) / 3600);
        const minutes = Math.floor((timer % 3600) / 60);
        const seconds = Math.floor(timer % 60);
        return { days, hours, minutes, seconds };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(bannerSettings.timer));

    useEffect(() => {
        if (bannerSettings.timer > 0) {
            const timerInterval = setInterval(() => {
                const newTimer = bannerSettings.timer - 1;
                setBannerSettings((prevSettings) => ({
                    ...prevSettings,
                    timer: newTimer,
                }));
                setTimeLeft(calculateTimeLeft(newTimer));
            }, 1000);
            return () => clearInterval(timerInterval);
        } else {
            setIsVisible(false);
        }
    }, [bannerSettings]);

    return (
        <div className='App'>
            {isVisible ? (
                <>
                    <h1>{bannerSettings.description}</h1>
                    <a href={bannerSettings.link} target="_blank" rel="noopener noreferrer" className="banner-link">
                        Click Here for More Info
                    </a>
                    <div className="clock-container">
                        <div className="clock-col">
                            <div className="clock-days clock-timer">{timeLeft.days}</div>
                            <div className="clock-label label-days">Days</div>
                        </div>
                        <div className="clock-col">
                            <div className="clock-hours clock-timer">{timeLeft.hours}</div>
                            <div className="clock-label label-hours">Hours</div>
                        </div>
                        <div className="clock-col">
                            <div className="clock-minutes clock-timer">{timeLeft.minutes}</div>
                            <div className="clock-label label-minutes">Minutes</div>
                        </div>
                        <div className="clock-col">
                            <div className="clock-seconds clock-timer">{timeLeft.seconds}</div>
                            <div className="clock-label label-seconds">Seconds</div>
                        </div>
                    </div>
                </>
            ) : (
                <div>
                    <h2>The banner is off</h2>
                </div>
            )}
            <Link to="/dashboard">Go to Dashboard</Link>
        </div>
    );
};

export default Banner;
