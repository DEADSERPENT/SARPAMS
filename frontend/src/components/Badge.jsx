import React from 'react';

const colorMap = {
  // Status
  'Open':             'badge-warning',
  'Assigned':         'badge-info',
  'Closed':           'badge-gray',
  'Pending':          'badge-warning',
  'Approved':         'badge-success',
  'Rejected':         'badge-danger',
  'Completed':        'badge-navy',
  // Health
  'Healthy':          'badge-success',
  'Under Treatment':  'badge-warning',
  'Adopted':          'badge-navy',
  'Unknown':          'badge-gray',
  'Recovered':        'badge-success',
  'Critical':         'badge-danger',
  // Cert level
  'Basic':            'badge-gray',
  'Intermediate':     'badge-info',
  'Advanced':         'badge-purple',
  // Bool
  'Yes':              'badge-success',
  'No':               'badge-gray',
  'Available':        'badge-success',
  'Unavailable':      'badge-danger',
  'Approved_fam':     'badge-success',
  'Pending_fam':      'badge-warning',
  // Sizes
  'Small':            'badge-info',
  'Medium':           'badge-navy',
  'Large':            'badge-purple',
  // Ongoing/other
  'Ongoing':          'badge-info',
};

export default function Badge({ value }) {
  const cls = colorMap[value] || 'badge-gray';
  return <span className={`badge ${cls}`}>{value}</span>;
}
