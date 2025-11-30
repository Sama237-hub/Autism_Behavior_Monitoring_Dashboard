import React from 'react';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import '../../styles/components/sidebar.css';
import '../../styles/components/header.css';

const MainLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;