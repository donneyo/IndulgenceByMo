import React from 'react';

const PrintValues = () => {
  // Define the initial values for part A
  const values = [2, 3, 5, 6, 8, 'Jack', 'Queen', 'King'];

  // Create an array for part B by appending another set of "Jack", "Queen", and "King"
  const partBValues = [...values, 'Jack', 'Queen', 'King'];

  return (
    <div>
      {/* Display part A */}
      <div>
        <strong>A: </strong>
        {values.map((value, index) => (
          <span key={index}>
            {value}
            {index < values.length - 1 && ', '}
          </span>
        ))}
      </div>

      {/* Display part B */}
      <div>
        <strong>B: </strong>
        {partBValues.map((value, index) => (
          <span key={index}>
            {value}
            {index < partBValues.length - 1 && ', '}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PrintValues;
