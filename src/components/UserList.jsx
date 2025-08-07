import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';

const cardStyle = {
  background: 'rgba(255,255,255,0.18)',
  borderRadius: '1.5rem',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: '4px solid',
  borderImage: 'linear-gradient(120deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%) 1',
  padding: '2.5rem 2rem',
  color: '#222',
  width: '100%',
  maxWidth: 700,
  margin: '2.5rem auto',
  position: 'relative',
  overflow: 'hidden',
  transition: 'box-shadow 0.2s',
  backgroundImage: `radial-gradient(circle at 80% 20%, #a5b4fc22 0%, transparent 60%),
    radial-gradient(circle at 20% 80%, #6ee7b722 0%, transparent 60%)`,
  boxSizing: 'border-box',
};
const titleStyle = {
  fontSize: '2.1rem',
  fontWeight: 900,
  marginBottom: '2.2rem',
  letterSpacing: '0.04em',
  color: '#2563eb',
  textShadow: '0 2px 16px rgba(37,99,235,0.10)'
};
const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0
};
const itemStyle = {
  background: 'rgba(255,255,255,0.32)',
  borderRadius: '1rem',
  marginBottom: '1.2rem',
  padding: '1.2rem 1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 2px 12px 0 rgba(37,99,235,0.07)',
  transition: 'transform 0.12s, box-shadow 0.12s',
  cursor: 'pointer',
};
const itemHoverStyle = {
  transform: 'scale(1.025)',
  boxShadow: '0 4px 24px 0 rgba(37,99,235,0.13)',
};
const avatarStyle = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  background: 'linear-gradient(135deg,#60a5fa 0%,#34d399 100%)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '1.2rem',
  color: '#fff',
  marginRight: 18,
  boxShadow: '0 2px 8px 0 rgba(52,211,153,0.10)'
};
const badgeStyle = status => ({
  background: status === 'active' ? '#34d399' : '#f87171',
  color: '#fff',
  borderRadius: '999px',
  padding: '0.25em 0.9em',
  fontSize: '0.95em',
  fontWeight: 700,
  marginLeft: 16,
  letterSpacing: '0.01em',
  boxShadow: status === 'active' ? '0 1px 6px #34d39944' : '0 1px 6px #f8717144',
});
const buttonStyle = {
  background: 'linear-gradient(90deg,#2563eb 0%,#60a5fa 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '0.5rem',
  padding: '0.45em 1.2em',
  marginLeft: 8,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '1em',
  boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)',
  transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
  outline: 'none',
};
const buttonDanger = {
  ...buttonStyle,
  background: 'linear-gradient(90deg,#dc2626 0%,#f87171 100%)',
};
const inputStyle = {
  borderRadius: '0.5rem',
  border: '1px solid #dbeafe',
  padding: '0.6em 1.1em',
  marginRight: 10,
  marginBottom: 8,
  fontSize: '1em',
  background: 'rgba(255,255,255,0.7)',
  color: '#222',
  outline: 'none',
  boxShadow: '0 1px 4px 0 rgba(37,99,235,0.04)'
};
const selectStyle = {
  ...inputStyle,
  marginBottom: 0
};
const actionGroupStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  marginLeft: 'auto',
};
const loaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '1.5rem 0',
};
const spinnerStyle = {
  width: 32,
  height: 32,
  border: '4px solid #60a5fa',
  borderTop: '4px solid #34d399',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

// Add keyframes for spinner animation
const styleSheet = document.styleSheets[0];
if (styleSheet && !Array.from(styleSheet.cssRules).find(r => r.name === 'spin')) {
  styleSheet.insertRule(`@keyframes spin { 100% { transform: rotate(360deg); } }`, styleSheet.cssRules.length);
}

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', status: 'active' });
  const [editUserId, setEditUserId] = useState(null);
  const [editUser, setEditUser] = useState({ username: '', email: '', status: 'active' });
  const [hovered, setHovered] = useState(null);
  const [adding, setAdding] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await UserService.create(newUser);
      setNewUser({ username: '', email: '', status: 'active' });
      fetchUsers();
    } catch (err) {
      setError('Failed to create user');
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditUser({ username: user.username, email: user.email, status: user.status });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await UserService.update(editUserId, editUser);
      setEditUserId(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await UserService.delete(id);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  if (loading) return <div style={cardStyle}>Loading users...</div>;
  if (error) return <div style={cardStyle}>{error}</div>;

  // Add animated hover effect to buttons
  const animatedButton = (style) => ({
    ...style,
    ':hover': {
      background: style.background.includes('dc2626')
        ? 'linear-gradient(90deg,#b91c1c 0%,#f87171 100%)'
        : 'linear-gradient(90deg,#1d4ed8 0%,#38bdf8 100%)',
      transform: 'translateY(-2px) scale(1.04)',
      boxShadow: '0 4px 16px 0 rgba(37,99,235,0.18)',
    },
  });

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>User List</div>
      <form onSubmit={handleCreate} style={{ marginBottom: 28, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={e => setNewUser({ ...newUser, username: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          required
          style={inputStyle}
        />
        <select
          value={newUser.status}
          onChange={e => setNewUser({ ...newUser, status: e.target.value })}
          style={selectStyle}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="submit" style={buttonStyle} disabled={adding}>Add User</button>
        {adding && (
          <span style={loaderStyle}>
            <span style={spinnerStyle}></span>
            <span style={{ marginLeft: 12, color: '#2563eb', fontWeight: 600 }}>Adding...</span>
          </span>
        )}
      </form>
      <ul style={listStyle}>
        {users.map(user => (
          <li
            key={user.id}
            style={hovered === user.id ? { ...itemStyle, ...itemHoverStyle } : itemStyle}
            onMouseEnter={() => setHovered(user.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {editUserId === user.id ? (
              <form onSubmit={handleUpdate} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, width: '100%' }}>
                <input
                  type="text"
                  value={editUser.username}
                  onChange={e => setEditUser({ ...editUser, username: e.target.value })}
                  required
                  style={inputStyle}
                />
                <input
                  type="email"
                  value={editUser.email}
                  onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                  required
                  style={inputStyle}
                />
                <select
                  value={editUser.status}
                  onChange={e => setEditUser({ ...editUser, status: e.target.value })}
                  style={selectStyle}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <span style={actionGroupStyle}>
                  <button type="submit" style={animatedButton(buttonStyle)}>Save</button>
                  <button type="button" onClick={() => setEditUserId(null)} style={animatedButton(buttonDanger)}>Cancel</button>
                </span>
              </form>
            ) : (
              <>
                <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <span style={avatarStyle}>{user.username.charAt(0).toUpperCase()}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1em' }}>{user.username}</span>
                  <span style={{ opacity: 0.7, marginLeft: 8, fontSize: '0.98em' }}>({user.email})</span>
                  <span style={badgeStyle(user.status)}>{user.status}</span>
                </span>
                <span style={actionGroupStyle}>
                  <button onClick={() => handleEdit(user)} style={animatedButton(buttonStyle)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)} style={animatedButton(buttonDanger)}>Delete</button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
