import React from 'react';

export default function Table({ headers, children, emptyMessage = 'No records found.' }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {React.Children.count(children) === 0
            ? <tr><td colSpan={headers.length} className="muted" style={{ textAlign: 'center', padding: '32px' }}>{emptyMessage}</td></tr>
            : children}
        </tbody>
      </table>
    </div>
  );
}
