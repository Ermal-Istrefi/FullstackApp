import React, { useState, useEffect } from "react";
import api from "../api";
import "./AddEditExpense.css";
import { Link, useNavigate, useParams } from "react-router-dom";

function AddEditExpense() {
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        description: '',
        date: '',
        paid: false,
        recurring: false,
        recurrenceInterval: ''
    });

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchExpense = async () => {
                try {
                    const response = await api.get('/expenses/' + id);
                    setFormData({
                        category: response.data.category,
                        amount: response.data.amount,
                        description: response.data.description,
                        date: response.data.date.split('T')[0],
                        paid: response.data.paid,
                        recurring: response.data.recurring || false,
                        recurrenceInterval: response.data.recurrenceInterval || ''
                    });
                } catch (error) {
                    console.error('Error fetching the expense:', error);
                }
            };
            fetchExpense();
        }
    }, [id]);

    const onChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
            if (id) {
                await api.put('/expenses/' + id, formData);
                alert('Expense modified');
                navigate('/dashboard');
            } else {
                await api.post('/expenses', formData);
                alert('Expense added');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Expense save error', error);
            alert('Error saving expense');
        }
    };

    return (
        <>
            <div>
                <Link to='/dashboard' className='dashboard-button'>
                    Go Back to Dashboard
                </Link>
                <h1 className="loginForm">{id ? 'Edit Expense' : 'Add Expense'}</h1>
                <form className="my-form" onSubmit={onSubmit}>
                    <label>
                        <input onChange={onChange} value={formData.category} type="text" placeholder="Category" name="category" required />
                    </label>
                    <label>
                        <input onChange={onChange} value={formData.amount} type="number" placeholder="Amount" name="amount" required />
                    </label>
                    <label>
                        <input onChange={onChange} value={formData.description} type="text" placeholder="Description" name="description" />
                    </label>
                    <label>
                        <input onChange={onChange} value={formData.date} type="date" placeholder="Date" name="date" required />
                    </label>
                    <label>
                        <input type="checkbox" checked={formData.paid} name="paid" onChange={onChange} />
                        Paid
                    </label>
                    <label>
                        <input type="checkbox" checked={formData.recurring} name="recurring" onChange={onChange} />
                        Recurring
                    </label>
                    {formData.recurring && (
                        <label>
                            Recurrence Interval:
                            <select name="recurrenceInterval" value={formData.recurrenceInterval} onChange={onChange}>
                                <option value="">Select Interval</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </label>
                    )}
                    <label>
                        <button type="submit">{id ? 'Edit Expense' : 'Add Expense'}</button>
                    </label>
                </form>
            </div>
        </>
    );
}

export default AddEditExpense;
