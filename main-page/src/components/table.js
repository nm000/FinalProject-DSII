import React from 'react';
import { CrimeDataList } from '../types';

const DataTable = ({ data }) => {
  if (!data) {
    return null;
  }

  const columns = Object.keys(data);

  return (
    <div className= 'hidden md:block' style={{ overflow: 'auto', maxHeight: '400px', backgroundColor: '#95a5a6', padding: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            {data && data.length > 0 && (
                <tr style={{ backgroundColor: '#2c3e50', color: '#ecf0f1' }}>
                    {Object.keys(data[0]).map((key) => (
                    <th key={key} style={{ fontSize: 18, padding: '10px', border: '1px solid #34495e' }}>
                        {key}
                    </th>
                    ))}
                </tr>
            )}

            </thead>
            <tbody>
            {data.map((item, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ecf0f1' : '#bdc3c7' }}>
                {Object.entries(item).map(([key, value], valueIndex) => (
                    <td key={valueIndex} style={{ fontSize: 14, padding: '8px', border: '1px solid #34495e', color: '#000000' }}>
                        {key === 'Date' ? new Date(value).toLocaleDateString(undefined, { timeZone: 'UTC' }) : (typeof value === 'boolean' ? value.toString() : value)}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
    </div>

  );
};

export default DataTable;