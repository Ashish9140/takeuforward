import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { remove, details } from '../assets/icons';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const headers = {
          'projectId': '66aa33568a5479d9d20fcfce',
          'environmentId': '66aa33568a5479d9d20fcfcf',
        };

        const offset = (currentPage - 1) * limit;

        const response = await axios.get('https://free-ap-south-1.cosmocloud.io/development/api/samplecrud', {
          headers,
          params: {
            limit,
            offset,
          },
        });

        console.log(response.data);

        if (Array.isArray(response.data.data)) {
          setEmployees(response.data.data);
          setTotalEmployees(response.data.page.total || 0); // Assuming the API returns total count
        } else {
          setEmployees([]);
        }

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [currentPage]);

  const handleDelete = async (emp_id) => {
    setDeletingId(emp_id);
    try {
      const headers = {
        'projectId': '66aa33568a5479d9d20fcfce',
        'environmentId': '66aa33568a5479d9d20fcfcf',
      };

      await axios.delete(`https://free-ap-south-1.cosmocloud.io/development/api/samplecrud/${emp_id}`, {
        headers,
        data: {}
      });

      const response = await axios.get('https://free-ap-south-1.cosmocloud.io/development/api/samplecrud', {
        headers,
        params: {
          limit,
          offset: (currentPage - 1) * limit,
        },
      });

      setEmployees(response.data.data);
      setTotalEmployees(response.data.page.total || 0);
    } catch (error) {
      console.error('Error deleting employee:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  
  const hasNextPage = totalEmployees > currentPage * limit; 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="employee-list">
      <h2>Employee List</h2>
      {employees.length === 0 ? (
        <div className='no-employee'>
          <span>No Employees in the system</span> <br/>
          <Link to="/add-employee" className="add-employee-link">Add Employee</Link>
        </div>
      ) : (
        <>
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id} className="employee-item">
                  <td>{employee._id}</td>
                  <td>{employee.name}</td>
                  <td className='action-icon'>
                    <Link to={`/employee/${employee._id}`} className="details-link" state={{ employee }} title='details'>
                      <img src={details} alt="details" className="icon details-icon" />
                    </Link>
                    <button onClick={() => handleDelete(employee._id)} className="delete-button" title='delete'>
                      {deletingId === employee._id ? (
                        <span>Deleting...</span>
                      ) : (
                        <img src={remove} alt="delete" className="icon delete-icon" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='employee-list-buttons'>
            <Link to="/add-employee" className="add-employee-link">Add Employee</Link>
            <div className="pagination-controls">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}>
                Previous
              </button>
              <span className="page-indicator">Page {currentPage}</span>
              <button
                onClick={handleNextPage}
                disabled={!hasNextPage} 
                className={`pagination-button ${!hasNextPage ? 'disabled' : ''}`}>
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeList;
