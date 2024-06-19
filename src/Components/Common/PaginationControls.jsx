import React from 'react';
import '../../Styles/Components/Common/PaginationControls.css';

const PaginationControls = ({ totalPages, currentPage, onPageChange }) => {
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);
        
        let startPage = Math.max(currentPage - halfVisible, 0);
        let endPage = Math.min(currentPage + halfVisible, totalPages - 1);

        if (startPage === 0) {
            endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
        }
        if (endPage === totalPages - 1) {
            startPage = Math.max(totalPages - maxVisiblePages, 0);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={`pagination-button ${i === currentPage ? 'active' : ''}`}
                    onClick={() => onPageChange(i)}
                    disabled={i === currentPage}
                >
                    {i + 1}
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="pagination-controls">
            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                Previous
            </button>
            {renderPageNumbers()}
            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
            >
                Next
            </button>
        </div>
    );
};

export default PaginationControls;
