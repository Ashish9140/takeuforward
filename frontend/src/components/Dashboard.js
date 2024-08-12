import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ updateBannerSettings, isVisible, setIsVisible }) => {
    const [description, setDescription] = useState('');
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [link, setLink] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleUpdateDescription = async () => {
        updateBannerSettings({ description });
        setSuccessMessage('Description updated successfully!');
        resetSuccessMessage();
    };

    const handleUpdateLink = async () => {
        updateBannerSettings({ link });
        setSuccessMessage('Link updated successfully!');
        resetSuccessMessage();
    };

    const handleUpdateTimer = async () => {
        const totalSeconds =
            Number(hours) * 3600 +
            Number(minutes) * 60 +
            Number(seconds);

        if (totalSeconds > 86399) {
            setError('The total time cannot exceed 23 hours, 59 minutes, and 59 seconds.');
            return;
        }

        const totalWithDays = totalSeconds + Number(days) * 86400;
        updateBannerSettings({ timer: totalWithDays });
        setSuccessMessage('Timer updated successfully!');
        resetSuccessMessage(); 
        setError('');
    };

    const resetSuccessMessage = () => {
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    const handleHoursChange = (e) => {
        const value = Math.min(Math.max(0, e.target.value), 23);
        setHours(value);
    };

    const handleMinutesChange = (e) => {
        const value = Math.min(Math.max(0, e.target.value), 59);
        setMinutes(value);
    };

    const handleSecondsChange = (e) => {
        const value = Math.min(Math.max(0, e.target.value), 59);
        setSeconds(value);
    };

    return (
        <div className="admin-dashboard">
            <h2>Dashboard</h2>

            {loading && <p>Loading...</p>} 
            {successMessage && <p className="success">{successMessage}</p>}

            <div className="dashboard-section">
                <h3>Update Banner Description</h3>
                <input
                    type="text"
                    placeholder="Banner Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <button onClick={handleUpdateDescription} disabled={loading}>Update Description</button>
            </div>

            <div className="dashboard-section">
                <h3>Update Banner Link</h3>
                <input
                    type="text"
                    placeholder="Banner Link"
                    value={link}
                    onChange={e => setLink(e.target.value)}
                />
                <button onClick={handleUpdateLink} disabled={loading}>Update Link</button>
            </div>

            <div className="dashboard-section">
                <h3>Update Timer</h3>
                <div>
                    <label>
                        Days:
                        <input
                            type="number"
                            value={days}
                            onChange={e => setDays(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Hours:
                        <input
                            type="number"
                            value={hours}
                            onChange={handleHoursChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Minutes:
                        <input
                            type="number"
                            value={minutes}
                            onChange={handleMinutesChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Seconds:
                        <input
                            type="number"
                            value={seconds}
                            onChange={handleSecondsChange}
                        />
                    </label>
                </div>
                <button onClick={handleUpdateTimer} disabled={loading}>Update Timer</button>
                {error && <p className="error">{error}</p>}
            </div>

            <div className="dashboard-section">
                <h3>Visibility Control</h3>
                <label>
                    <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={e => {
                            setIsVisible(e.target.checked);
                        }}
                        disabled={loading}
                    />
                    Show Banner
                </label>
            </div>

            <div className="dashboard-section">
                <Link to="/">Go to Banner</Link>
            </div>
        </div>
    );
};

export default Dashboard;
