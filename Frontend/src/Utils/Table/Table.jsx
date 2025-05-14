// __________backeup code above____

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import NoData from "./nodata.jpg";

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
  page,
  isPage = true,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    if (isPage === false && page !== undefined) {
      setCurrentPage(page - 1); // Adjust for 0-based index
    }
  }, [page, isPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, pageCount - 1));
  };

  const startRowIndex = isPage
    ? currentPage * rowsPerPage
    : (page - 1) * rowsPerPage;
  const currentPageData = isPage
    ? data.slice(startRowIndex, startRowIndex + rowsPerPage)
    : data; // Use full data if custom pagination is used

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
  {data && data.length === 0 ? (
    <tr>
      <td colSpan={columns.length + 1} className="text-center">
        <div className="d-flex justify-content-center align-items-center flex-column">
          <img
            src={NoData}
            alt="No Data"
            style={{ width: "20%" }}
          />
          <h4 className="text-muted">No Data Available</h4>
        </div>
      </td>
    </tr>
  ) : (
    currentPageData.map((row, rowIndex) => (
      <tr key={rowIndex + startRowIndex} className={rowClassName}>
        <td>{isPage ? rowIndex + 1 + startRowIndex : rowIndex + 1}</td>
        {columns.map((column, columnIndex) => (
          <td key={columnIndex} className={cellClassName}>
            {column.Cell
              ? column.Cell({ cell: { value: row[column.accessor], row } })
              : renderCustomCell
              ? renderCustomCell(row[column.accessor], row)
              : row[column.accessor]}
          </td>
        ))}
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>

      {isPage && (
        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="pagination-button pagination-button-left"
          >
            <ArrowLeft size={20} />
          </button>
          <span>
            Page {currentPage + 1} of {pageCount}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === pageCount - 1}
            className="pagination-button pagination-button-right"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      )}
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
