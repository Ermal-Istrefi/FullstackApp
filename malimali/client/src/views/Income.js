import React, { useState, useEffect } from "react";
import api from '../api';
import { Link, useNavigate } from "react-router-dom";
import './Income.css';
import Sidebar from "./Sidebar";

function Income() {
    const [incomes, setIncomes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteIncomeId, setDeleteIncomeId] = useState('');

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filter, setFilter] = useState({
        name: '',
        amount: '',
        amountCondition: 'equal',
        received: '',
        date: '',
        dateCondition: 'equal'
    });

    const navigate = useNavigate();

    const getIncomes = async () => {
        const response = await api.get('/incomes');
        setIncomes(response.data);
    }

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
            return;
        }

        getIncomes();
    }, []);

    const handleLogOut = async (event) => {
        localStorage.removeItem('token');
        navigate('/');
    }

    const cancelDelete = () => {
        setShowModal(false);
    }

    const deleteIncome = async () => {
        await api.delete('/incomes/' + deleteIncomeId);
        setShowModal(false);
        getIncomes();
        alert('Income Deleted');
    }

    const confirmDelete = (incomeId) => {
        setShowModal(true);
        setDeleteIncomeId(incomeId);
    }

    const handleEdit = (incomeId) => {
        navigate('/income/edit/' + incomeId)
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    }

    const applyFilter = async () => {
        const response = await api.get('/incomes', { params: filter });
        setIncomes(response.data);
        setShowFilterModal(false);
    }

    return (
        <div>
            <h1>Incomes</h1>
            <Sidebar />
            <div className='buttons' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', marginRight: '20px' }}>
                <Link to='/income/add'>
                    <button className='btn btn-primary' style={{ marginRight: '10px' }}>
                        Add incomes
                    </button>
                </Link>
                <button onClick={() => setShowFilterModal(true)} className='btn btn-secondary'>
                    Filter
                </button>
                <button onClick={handleLogOut} className='btn btn-primary'>
                    Log Out
                </button>
            </div>

            <table className='table'>
                <thead>
                    <tr>
                        <th>
                            Category
                        </th>
                        <th>
                            Amount
                        </th>
                        <th>
                            Received
                        </th>
                        <th>
                            Date
                        </th>
                        <th>
                            Description
                        </th>
                        <th>
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {incomes.map(income => (
                        <tr key={income._id}>
                            <td>
                                {income.category}
                            </td>
                            <td>
                                {income.amount}
                            </td>
                            <td>
                                <input type="checkbox" checked={income.received} disabled='disabled' />
                            </td>
                            <td>
                                {new Date(income.date).toLocaleDateString()}
                            </td>
                            <td>
                                {income.description}
                            </td>
                            <td>
                                <button onClick={() => handleEdit(income._id)} className="btn btn-primary mr-2">
                                    Edit
                                </button>
                                <button onClick={() => confirmDelete(income._id)} className="btn btn-danger mr-2">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            { showModal ?
   <div className='confirm-overlay'>
      <div className='confirm-dialog'>
        <p>Are you sure you want to delete expense</p>
        <button onClick={deleteIncome}>Yes</button>
        <button onClick={cancelDelete}>No</button>
      </div>
    </div> : ''
  }

{showFilterModal &&
                <div className='filter-overlay'>
                    <div className='filter-dialog'>
                        <h2>Filter Income</h2>
                        <div className='filter-group'>
                            <label>Category:</label>
                            <input
                                type="text"
                                name="name"
                                value={filter.name}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className='filter-group'>
                            <label>Amount:</label>
                            <input
                                type="number"
                                name="amount"
                                value={filter.amount}
                                onChange={handleFilterChange}
                            />
                            <select
                                name="amountCondition"
                                value={filter.amountCondition}
                                onChange={handleFilterChange}
                            >
                                <option value="equal">Equal</option>
                                <option value="bigger">Bigger</option>
                                <option value="smaller">Smaller</option>
                            </select>
                        </div>
                        <div className='filter-group'>
                            <label>Received:</label>
                            <select
                                name="paid"
                                value={filter.paid}
                                onChange={handleFilterChange}
                            >
                                <option value="">Any</option>
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        </div>
                        <div className='filter-group'>
                            <label>Date:</label>
                            <input
                                type="date"
                                name="date"
                                value={filter.date}
                                onChange={handleFilterChange}
                            />
                            <select
                                name="dateCondition"
                                value={filter.dateCondition}
                                onChange={handleFilterChange}
                            >
                                <option value="equal">Equal</option>
                                <option value="bigger">Bigger</option>
                                <option value="smaller">Smaller</option>
                            </select>
                        </div>
                        <div className='filter-buttons'>
                            <button onClick={applyFilter}>Apply Filter</button>
                            <button onClick={() => setShowFilterModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            }


      {/* {expenses.map(expense => (
        <p>
           {expense.category}: {expense.amount} - {expense.description} on {new Date(expense.date).toLocaleDateString()} 
        </p>
      ))} */}
    </div>
  )}


export default Income;
