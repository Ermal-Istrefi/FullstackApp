
import React, { useState, useEffect } from "react";
import api from '../api';
import { Link, useNavigate } from "react-router-dom";
import './Income.css';
import Sidebar from "./Sidebar";

function Income() {
    const [incomes, setIncomes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteIncomeId, setDeleteIncomeId] = useState('');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
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
        const response = await api.get('/incomes', { params: { ...filter, page, limit, sortField, sortOrder } });
        setIncomes(response.data.incomes);
        setTotal(response.data.total);
    }

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
            return;
        }

        getIncomes();
    }, [page, limit, sortField, sortOrder]);

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
        setPage(1); 
        getIncomes();
        setShowFilterModal(false);
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
    }

    const handleSortChange = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    }

    return (
        <div className="income-container">
            <h1 id="title">Incomes</h1>
            <Sidebar />
            <div className='income-header'>
                <div className='income-buttons'>
                    <Link to='/income/add'>
                        <button className='btn-primary-custom'>
                            Add Income
                        </button>
                    </Link>
                        <button onClick={() => setShowFilterModal(true)} className='btn-secondary-custom'>
                            Filter
                        </button>
                        <button onClick={handleLogOut} className='btn-primary-custom' id="logout">
                            Log Out
                        </button>
                </div>
            </div>


            <div className='incomes-frame'>
                <table className='incomes-table'>
                    <thead>
                        <tr>
                            {/* Sortimi - Start */}
                            <th onClick={() => handleSortChange('category')}>
                                Category {sortField === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th onClick={() => handleSortChange('amount')}>
                                Amount {sortField === 'amount' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th>
                                Paid
                            </th>
                            <th onClick={() => handleSortChange('date')}>
                                Date {sortField === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            {/* Sortimi - End */}
                            <th>
                                Description
                            </th>
                            <th>
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                    {
                        incomes.map(income => (
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
                                    <button onClick={() => handleEdit(income._id)} className="btn-icon">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button onClick={() => confirmDelete(income._id)} className="btn-icon">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

        <div className='custom-pagination'>
            {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
                <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={page === i + 1 ? 'active' : ''}>
                    {i + 1}
                </button>
                ))}
        </div>

            {showModal &&
                <div className='confirm-overlay-custom'>
                    <div className='confirm-dialog-custom'>
                        <p>Are you sure you want to delete this income?</p>
                        <button onClick={deleteIncome} id="yes">Yes</button>
                        <button onClick={cancelDelete} id="no">No</button>
                    </div>
                </div>
            }

            {showFilterModal &&
                <div className='filter-overlay-custom'>
                    <div className='filter-dialog-custom'>
                        <h2>Filter Income</h2>
                        <div className='filter-group-custom'>
                            <label>Category:</label>
                            <input
                                type="text"
                                name="name"
                                value={filter.name}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className='filter-group-custom'>
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
                        <div className='filter-group-custom'>
                            <label>Received:</label>
                            <select
                                name="received"
                                value={filter.received}
                                onChange={handleFilterChange}
                            >
                                <option value="">Any</option>
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        </div>
                        <div className='filter-group-custom'>
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
                        <div className='filter-buttons-custom'>
                            <button onClick={applyFilter}>Apply Filter</button>
                            <button onClick={() => setShowFilterModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Income;
