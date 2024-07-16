import React from 'react';
import PropTypes from 'prop-types';

const Table = ({
  columns,
  data,
  tableClassName = "table table-responsive-md",
  tableContainerClassName = "table-responsive",
  rowClassName = "",
  headerClassName = "",
  cellClassName = "",
  renderCustomHeader,
  renderCustomCell
}) => {
  return (
    <div className={tableContainerClassName}>
      <table className={tableClassName}>
        <thead>
          <tr className={headerClassName}>
            <th>S.no</th> {/* Add a header for the index */}
            {columns.map((column, index) => (
              <th key={index}>
                {renderCustomHeader ? renderCustomHeader(column) : column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowClassName}>
              <td>{rowIndex + 1}</td> {/* Display the index dynamically */}
              {columns.map((column, columnIndex) => (
                <td key={columnIndex} className={cellClassName}>
                  {column.Cell ? column.Cell({ cell: { value: row[column.accessor], row } }) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      Cell: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableClassName: PropTypes.string,
  tableContainerClassName: PropTypes.string,
  rowClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  cellClassName: PropTypes.string,
  renderCustomHeader: PropTypes.func,
  renderCustomCell: PropTypes.func,
};

export default Table;
