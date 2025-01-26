import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>Stonk Tracker</h1>
      <ul style={styles.navList}>
        <li><Link to="/" style={styles.link}>Dashboard</Link></li>
        <li><Link to="/about" style={styles.link}>About</Link></li>
        <li><Link to="/browse" style={styles.link}>Browse</Link></li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#203354',
    color: '#faf8ef',
  },
  logo: {
    fontSize: '1.5rem',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
  },
  link: {
    margin: '0 1rem',
    textDecoration: 'none',
    color: '#faf8ef',
  },
};

export default Navbar;