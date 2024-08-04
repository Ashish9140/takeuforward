import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import countries from '../constants/countries';

const AddEmployee = () => {
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [address, setAddress] = useState({ line1: '', city: '', country: '', zip: '' });
  const [contactMethods, setContactMethods] = useState([
    { contact_method: 'Email', value: '' },
    { contact_method: 'Phone', value: '' }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    validateForm();
  }, [name, address, contactMethods]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const handleContactMethodChange = (index, e) => {
    const { name, value } = e.target;
    const newContactMethods = [...contactMethods];
    newContactMethods[index][name] = value;
    setContactMethods(newContactMethods);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Zip Code (numbers only)
    if (address.zip && !/^\d+$/.test(address.zip)) {
      newErrors.zip = 'ZIP Code must contain only numbers.';
    }

    // Validate contact methods
    if (contactMethods[0].value && !/\S+@\S+\.\S+/.test(contactMethods[0].value)) {
      newErrors.email = 'Email is not valid.';
    }

    if (contactMethods[1].value) {
      if (!/^\d+$/.test(contactMethods[1].value)) {
        newErrors.phone = 'Phone number must contain only numbers.';
      } else if (contactMethods[1].value.length !== 10) {
        newErrors.phone = 'Phone number must be exactly 10 digits.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const employeeData = {
      name,
      address,
      contact_methods: contactMethods,
    };

    console.log(employeeData);

    const headers = {
      'Content-Type': 'application/json',
      'projectId': '66aa33568a5479d9d20fcfce',
      'environmentId': '66aa33568a5479d9d20fcfcf',
    };

    try {
      await axios.post('https://free-ap-south-1.cosmocloud.io/development/api/samplecrud', employeeData, { headers });
      navigate('/');
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <main className="main page__main">
      <h2>Add Employee</h2>
      <form className="form main__form" onSubmit={handleSubmit}>
        <div className="form__linput">
          <label className="form__label" htmlFor="fname">Name</label>
          <input
            className="form__input"
            id="fname"
            type="text"
            name="fname"
            placeholder="Your name..."
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form__linput">
          <label className="form__label" htmlFor="address-line1">Address Line 1</label>
          <input
            className="form__input"
            id="address-line1"
            type="text"
            name="line1"
            placeholder="Your address line 1..."
            required
            onChange={handleAddressChange}
          />
          {errors.line1 && <p className="error">{errors.line1}</p>}
        </div>

        <div className="form__linput">
          <label className="form__label" htmlFor="address-city">City</label>
          <input
            className="form__input"
            id="address-city"
            type="text"
            name="city"
            placeholder="Your city..."
            required
            onChange={handleAddressChange}
          />
        </div>

        <div className="form__linput">
          <label className="form__label" htmlFor="country-select">Country</label>
          <select
            className="form__select"
            id="country-select"
            name="country"
            onChange={handleAddressChange}
            required
          >
            <option value="">Please choose your country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>{country.name}</option>
            ))}
          </select>
        </div>

        <div className="form__linput">
          <label className="form__label" htmlFor="address-zip">ZIP Code</label>
          <input
            className="form__input"
            id="address-zip"
            type="text"
            name="zip"
            placeholder="Your ZIP code..."
            required
            onChange={handleAddressChange}
          />
          {errors.zip && <p className="error">{errors.zip}</p>}
        </div>

        {contactMethods.map((contactMethod, index) => (
          <div key={index} className="form__linput">
            <label className="form__label" htmlFor={`contact-${contactMethod.contact_method}`}>{contactMethod.contact_method}</label>
            <input
              className="form__input"
              id={`contact-${contactMethod.contact_method}`}
              type="text"
              name="value"
              placeholder={`Your ${contactMethod.contact_method.toLowerCase()}...`}
              value={contactMethod.value}
              onChange={(e) => handleContactMethodChange(index, e)}
              required
            />
            {errors[contactMethod.contact_method.toLowerCase()] && <p className="error">{errors[contactMethod.contact_method.toLowerCase()]}</p>}
          </div>
        ))}

        <button className="primary-btn form__btn" type="submit">Add Employee</button>

        <Link to="/" className="back-link">Back to List</Link>
      </form>
    </main>
  );
};

export default AddEmployee;
