import React from "react";
import "./PaginationStyles.css"; 

const PaginationControls = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage); 

  const handlePrevPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-controls">
      <button onClick={handlePrevPage} disabled={currentPage === 0}>
        Previous
      </button>
      <span>
        Page {currentPage + 1} of {totalPages}
      </span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
