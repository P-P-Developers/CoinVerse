
// __________backeup code above____

import React, { useState } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Table = ({
  columns,
  data,
  rowsPerPage = 10, // Default rows per page
  tableClassName = "table table-responsive-md",
  tableContainerClassName = "table-responsive",
  rowClassName = "",
  headerClassName = "",
  cellClassName = "",
  renderCustomHeader,
  renderCustomCell,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(data.length / rowsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pageCount - 1));
  };

  const startRowIndex = currentPage * rowsPerPage;
  const currentPageData = data.slice(
    startRowIndex,
    startRowIndex + rowsPerPage
  );

  return (
    <div>
      <div className={tableContainerClassName}>
        <table className={tableClassName}>
          <thead>
            <tr className={headerClassName}>
              <th>S.no</th>
              {columns.map((column, index) => (
                <th key={index}>
                  {renderCustomHeader
                    ? renderCustomHeader(column)
                    : column.Header}
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
                    {column.Cell
                      ? column.Cell({
                          cell: { value: row[column.accessor], row },
                        })
                      : renderCustomCell
                        ? renderCustomCell(row[column.accessor], row)
                        : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="pagination-button pagination-button-left">
          <ArrowLeft size={20} />
        </button>
        <span>
          Page {currentPage + 1} of {pageCount}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === pageCount - 1}
          className="pagination-button pagination-button-right">
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      Cell: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowsPerPage: PropTypes.number,
  tableClassName: PropTypes.string,
  tableContainerClassName: PropTypes.string,
  rowClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  cellClassName: PropTypes.string,
  renderCustomHeader: PropTypes.func,
  renderCustomCell: PropTypes.func,
};

export default Table;
