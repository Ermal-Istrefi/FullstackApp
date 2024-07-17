import React, { useState, useEffect } from "react";
import api from "../api";
import "./AddEditIncome.css";
import { Link, useParams, useNavigate } from "react-router-dom";

function AddEditIncome() {
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        description: '',
        date: '',
        received: false,
        recurring: false,
        recurrenceInterval: ''
    });

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchIncome = async () => {
                try {
                    const response = await api.get('/incomes/' + id);
                    setFormData({
                        category: response.data.category,
                        amount: response.data.amount,
                        description: response.data.description,
                        date: response.data.date.split('T')[0],
                        received: response.data.received,
                        recurring: response.data.recurring || false,
                        recurrenceInterval: response.data.recurrenceInterval || ''
                    });
                } catch (error) {
                    console.error('Error fetching the income:', error);
                }
            };
            fetchIncome();
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
                await api.put('/incomes/' + id, formData);
                alert('Income modified');
            } else {
                await api.post('/incomes', formData);
                alert('Income added');
            }
            navigate('/income');
        } catch (error) {
            console.error('Income save error', error);
            alert('Error saving income');
        }
    };

    return (
        <>
            <div>
                <Link to='/income' className='income-button'>
                    Go Back to Income
                </Link>
                <h1 className="loginForm">{id ? 'Edit Income' : 'Add Income'}</h1>
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
                        <input type="checkbox" checked={formData.received} name="received" onChange={onChange} />
                        Received
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
                        <button type="submit">{id ? 'Edit Income' : 'Add Income'}</button>
                    </label>
                </form>
            </div>
        </>
    );
}

export default AddEditIncome;
