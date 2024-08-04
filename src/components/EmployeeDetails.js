import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const EmployeeDetails = () => {
  const location = useLocation();
  const { employee } = location.state;

  return (
    <div className="employee-details">
      <h2 className="details-title">Employee Details</h2>
      <div className="details-content">
        <div className="details-item">
          <span className='details-item-heading'>Name:</span> <span className=''>{employee.name}</span>
        </div>
        <div className="details-item">
          <span className='details-item-heading'>Employee ID:</span> <span>{employee._id}</span>
        </div>
        <div className="details-item">
          <span className='details-item-heading'>Address:</span>
          <div className="address ">
            <p><span className='details-item-heading2'>Line1:</span> <span>{employee.address.line1}</span> </p>
            <p><span className='details-item-heading2'>City:</span> <span>{employee.address.city}</span> </p>
            <p><span className='details-item-heading2'>Country:</span> <span>{employee.address.country}</span> </p>
            <p><span className='details-item-heading2'>Zip Code:</span> <span>{employee.address.zip}</span> </p>
          </div>
        </div>
        <div className="details-item">
          <span className='details-item-heading'>Contact Methods:</span>
          <ul className="contact-methods">
            {employee.contact_methods.map((method, index) => (
              <li key={index} className="contact-method">
                <span className='details-item-heading2'>{method.contact_method}:</span> <span>{method.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Link to="/" className="back-link">Back to List</Link>
    </div>
  );
}; 

export default EmployeeDetails;
