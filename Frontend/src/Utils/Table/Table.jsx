import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(data.length / rowsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pageCount - 1));
  };

  const startRowIndex = currentPage * rowsPerPage;
  const currentPageData = data.slice(startRowIndex, startRowIndex + rowsPerPage);

  return (
    <div className={tableContainerClassName}>
      <table className={tableClassName}>
        <thead>
          <tr className={headerClassName}>
            <th>S.no</th>
            {columns.map((column, index) => (
              <th key={index}>
                {renderCustomHeader ? renderCustomHeader(column) : column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((row, rowIndex) => (
            <tr key={rowIndex + startRowIndex} className={rowClassName}>
              <td>{rowIndex + 1 + startRowIndex}</td>
              {columns.map((column, columnIndex) => (
                <td key={columnIndex} className={cellClassName}>
                  {column.Cell ? column.Cell({ cell: { value: row[column.accessor], row } }) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button 
          onClick={handlePreviousPage} 
          disabled={currentPage === 0} 
          className="pagination-button pagination-button-left"
        >
          <ArrowLeft size={20} />
        </button>
        <span>Page {currentPage + 1} of {pageCount}</span>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === pageCount - 1} 
          className="pagination-button pagination-button-right"
        >
          <ArrowRight size={20} />
        </button>
      </div>
      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          position: relative;
          padding: 10px 0;
          background-color: #f8f9fa;
          border-radius: 5px;
        }
        .pagination-button {
          border: none;
          background: none;
          cursor: pointer;
          margin: 0 10px;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .pagination-button-left {
          left: 0;
        }
        .pagination-button-right {
          right: 0;
        }
        .pagination-button:hover:not(:disabled) {
          background-color: #e2e6ea;
          border-radius: 50%;
          transform: translateY(-50%) scale(1.1);
        }
        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pagination span {
          flex-grow: 1;
          text-align: center;
          font-size: 1rem;
          color: #495057;
        }
      `}</style>
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
