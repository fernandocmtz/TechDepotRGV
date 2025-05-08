import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface User {
  user_id: number;
  username: string;
  email: string;
  phone_number?: string;
  role?: string;
}

interface Props {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
}

const UserForm: React.FC<Props> = ({ user, onUserUpdate }) => {
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.put<User>(
        'http://localhost:5001/api/auth/users',
        { email, phone_number: phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('Profile updated successfully.');
      setError('');
      onUserUpdate(response.data.user || user); // fallback if user isn't returned
    } catch (err: any) {
      setMessage('');
      setError(err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <div>
      <h3>Update General Info</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input type="text" value={user.username} disabled />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Phone Number: </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UserForm;
