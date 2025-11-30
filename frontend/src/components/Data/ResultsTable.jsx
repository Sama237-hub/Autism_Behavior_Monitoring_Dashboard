import React, { useState, useMemo } from 'react';

const ResultsTable = () => {
  const [sortField, setSortField] = useState('confidence');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sampleData = [
    { id: 'PT-001', age: 8, gender: 'Male', confidence: 94, severity: 'Mild', date: '2024-01-15' },
    { id: 'PT-002', age: 6, gender: 'Female', confidence: 87, severity: 'Moderate', date: '2024-01-15' },
    { id: 'PT-003', age: 10, gender: 'Male', confidence: 92, severity: 'Mild', date: '2024-01-14' },
    { id: 'PT-004', age: 7, gender: 'Female', confidence: 78, severity: 'Severe', date: '2024-01-14' },
    { id: 'PT-005', age: 9, gender: 'Male', confidence: 95, severity: 'Moderate', date: '2024-01-13' },
    { id: 'PT-006', age: 5, gender: 'Female', confidence: 82, severity: 'Mild', date: '2024-01-13' },
    { id: 'PT-007', age: 11, gender: 'Male', confidence: 88, severity: 'Moderate', date: '2024-01-12' },
    { id: 'PT-008', age: 8, gender: 'Female', confidence: 91, severity: 'Mild', date: '2024-01-12' },
    { id: 'PT-009', age: 6, gender: 'Male', confidence: 76, severity: 'Severe', date: '2024-01-11' },
    { id: 'PT-010', age: 7, gender: 'Female', confidence: 93, severity: 'Moderate', date: '2024-01-11' },
  ];

  const sortedData = useMemo(() => {
    return [...sampleData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
  }, [sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'mild': return 'var(--accent-green)';
      case 'moderate': return 'var(--accent-orange)';
      case 'severe': return 'var(--accent-red)';
      default: return 'var(--gray-500)';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'var(--accent-green)';
    if (confidence >= 80) return 'var(--accent-orange)';
    return 'var(--accent-red)';
  };

  return (
    <div className="results-table-container">
      <div className="table-header">
        <h3>Diagnosis Results</h3>
        <div className="table-actions">
          <button className="btn-outline">Export CSV</button>
          <button className="btn-primary">Print Report</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>
                Patient ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('age')}>
                Age {sortField === 'age' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('gender')}>
                Gender {sortField === 'gender' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('confidence')}>
                Confidence {sortField === 'confidence' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('severity')}>
                Severity {sortField === 'severity' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('date')}>
                Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id}>
                <td className="patient-id">{row.id}</td>
                <td>{row.age}</td>
                <td>{row.gender}</td>
                <td>
                  <div 
                    className="confidence-cell"
                    style={{ color: getConfidenceColor(row.confidence) }}
                  >
                    {row.confidence}%
                  </div>
                </td>
                <td>
                  <span 
                    className="severity-badge"
                    style={{ 
                      backgroundColor: getSeverityColor(row.severity),
                      color: 'white'
                    }}
                  >
                    {row.severity}
                  </span>
                </td>
                <td>{row.date}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-sm btn-outline">View</button>
                    <button className="btn-sm btn-primary">Export</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <button 
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        
        <div className="pagination-info">
          Page {currentPage} of {totalPages}
        </div>
        
        <button 
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ResultsTable;