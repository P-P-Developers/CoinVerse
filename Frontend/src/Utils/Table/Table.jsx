import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import NoData from "./nodata.jpg";

const Table = ({
  columns,
  data,
  rowsPerPage = 10,
  tableClassName = "table",
  tableContainerClassName = "table-responsive",
  rowClassName = "",
  headerClassName = "",
  cellClassName = "",
  renderCustomHeader,
  renderCustomCell,
  page,
  isPage = true,
  search
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const pageCount = Math.ceil(data.length / rowsPerPage);
  const startRowIndex = isPage ? currentPage * rowsPerPage : (page - 1) * rowsPerPage;
  const currentPageData = isPage
    ? data.slice(startRowIndex, startRowIndex + rowsPerPage)
    : data;

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300); // Change to 2000 for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  // Sync page if controlled externally
  useEffect(() => {
    if (!isPage && page !== undefined) {
      setCurrentPage(page - 1);
    }
  }, [page, isPage]);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      const next = prev + direction;
      return Math.max(0, Math.min(next, pageCount - 1));
    });
  };



  useEffect(() => {
    setCurrentPage(0);

  }, [search]);


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }



  return (
    <div>
      <div className={tableContainerClassName}>
        <table className={tableClassName}>
          <thead>
            <tr className={headerClassName}>
              <th>S.no</th>
              {columns.map((col, idx) => (
                <th key={idx}>
                  {renderCustomHeader ? renderCustomHeader(col) : col.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center">
                  <div className="d-flex justify-content-center align-items-center flex-column">
                    <img src={NoData} alt="No Data" style={{ width: "20%" }} />
                    <h4 className="text-muted">No Data Available</h4>
                  </div>
                </td>
              </tr>
            ) : (
              currentPageData.map((row, rowIndex) => (
                <tr key={rowIndex + startRowIndex} className={rowClassName}>
                  <td>{rowIndex + 1 + startRowIndex}</td>
                  {columns.map((col, colIndex) => {
                    const value = row[col.accessor];
                    return (
                      <td key={colIndex} className={cellClassName}>
                        {col.Cell
                          ? col.Cell({ cell: { value, row } })
                          : renderCustomCell
                          ? renderCustomCell(value, row)
                          : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isPage && (
        <div className="pagination d-flex align-items-center justify-content-center gap-3 mt-3">
          <button
            onClick={() => handlePageChange(-1)}
            disabled={currentPage === 0}
            className="pagination-button pagination-button-left"
          >
            <ArrowLeft size={20} />
          </button>
          <span>
            Page {currentPage + 1} of {pageCount}
          </span>
          <button
            onClick={() => handlePageChange(1)}
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
  page: PropTypes.number,
  isPage: PropTypes.bool,
};

export default Table;
