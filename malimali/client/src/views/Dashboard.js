import React, {useState, useEffect} from "react";
import api from '../api';
import { Link, useNavigate } from "react-router-dom";
import './Dashboard.css';
import Sidebar from "./Sidebar";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteExpenseId, setDeleteExpenseId] = useState('');

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
      paid: '',
      date: '',
      dateCondition: 'equal'
    });

    const navigate = useNavigate();


    const getExpenses = async() => {
      const response = await api.get('/expenses', {params: {...filter, page, limit, sortField, sortOrder}});
      console.log(response.data)
      setExpenses(response.data.expenses);
      setTotal(response.data.total);
  }

    useEffect(() => {
        if (!localStorage.getItem('token')) {
          navigate('/');
          return;
        }

        getExpenses();
    }, [page, limit, sortField, sortOrder]);

    const handleLogOut = async(event) => {
      localStorage.removeItem('token');
      navigate('/');
    }

    const cancelDelete = () => {
      setShowModal(false);
    }

    const deleteExpense =  async () => {
      await api.delete('/expenses/' + deleteExpenseId);
      setShowModal(false);
      getExpenses();
      alert('Expense Deleted');
    }

    const confirmDelete = (expenseId) => {
      console.log(expenseId);

      setShowModal(true);
      setDeleteExpenseId(expenseId);
    }

    const handleEdit = (expenseId) => {
      navigate('/expense/edit/' + expenseId)
    }

    const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilter({ ...filter, [name]: value });
      console.log(filter);
    }

    const handleSortChange = (field) => {
      const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
      setSortField(field);
      setSortOrder(order)
    }

    const applyFilter = async() => {
      setPage(1);
      const response = await api.get('/expenses', { params: filter });
      setExpenses(response.data);
      setShowFilterModal(false);
    }

    const handlePageChange = (newPage) => {
      console.log(newPage);
      setPage(newPage);
      getExpenses();
    }



  return (
    <div>
      <h1>Expenses</h1>
      <Sidebar/>
      <div className='buttons' style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', marginRight: '20px' }}>
        <Link to='/expense/add'>
        <button className='btn btn-primary' style={{ marginRight: '10px' }}>
          Add expenses
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
            <th onClick={() => handleSortChange('category')}>
              Category {sortField === 'category' ? 
              (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th>
              Amount
            </th>
            <th>
              Paid
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
        {
          expenses.map(expense => (
            <tr>
              <td>
                {expense.category}
              </td>
              <td>
                {expense.amount}
              </td>
              <td>
                <input type="checkbox" checked={expense.paid} disabled='disabled' />
              </td>
              <td>
                {new Date(expense.date).toLocaleDateString()}
              </td>
              <td>
                {expense.description}
              </td>
              <td>
                 <button onClick={() => handleEdit(expense._id)} className="btn btn-primary mr-2">
                     Edit
                 </button>
 
                 <button onClick={() => confirmDelete(expense._id)} className="btn btn-danger mr-2">
                     Delete
                 </button>
              </td>
            </tr>
          ))
        }
      



        </tbody>
      </table>

      <div className='pagination'>
                    {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={page === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

   { showModal ?
   <div className='confirm-overlay'>
      <div className='confirm-dialog'>
        <p>Are you sure you want to delete expense</p>
        <button onClick={deleteExpense}>Yes</button>
        <button onClick={cancelDelete}>No</button>
      </div>
    </div> : ''
  }

{showFilterModal &&
                <div className='filter-overlay'>
                    <div className='filter-dialog'>
                        <h2>Filter Expenses</h2>
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
                            <label>Paid:</label>
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

export default Dashboard;