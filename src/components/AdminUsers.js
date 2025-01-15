import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/admin/users');
            setUsers(response.data);
        } catch (err) {
            setError('Error fetching users');
            console.error('Error fetching users:', err);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await axios.put(`/admin/users/${userId}/role`, { role: newRole });
            const updatedUser = response.data;
            setUsers(users.map(user => (user.id === userId ? updatedUser : user)));
        } catch (err) {
            setError('Error updating user role');
            console.error('Error updating user role:', err);
        }
    };

    return (
        <div>
            <h1>Admin User Management</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th>Date of Birth</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.surname}</td>
                            <td>{user.email}</td>
                            <td>{user.dob}</td>
                            <td>{user.role}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
