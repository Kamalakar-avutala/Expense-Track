import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const Table = ({
  data,
  columns,
  onRowClick,
  isLoading,
  striped = true,
  hover = true,
  responsive = true,
  size = 'md',
  emptyMessage = 'No data available',
  className = '',
  pageSizeOptions = [5, 10, 25, 50]
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Set default items per page from the first option
  const [itemsPerPage, setItemsPerPage] = useState(pageSizeOptions[0]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item =>
      columns.some(column =>
        String(item[column.key] ?? '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
      });
    }

    return filtered;
  }, [data, searchTerm, columns, sortConfig]);

  const { currentItems, totalPages } = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return {
      currentItems: filteredAndSortedData.slice(indexOfFirstItem, indexOfLastItem),
      totalPages: Math.max(1, Math.ceil(filteredAndSortedData.length / itemsPerPage))
    };
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const tableClasses = useMemo(() => {
    return [
      'table',
      striped && 'table-striped',
      hover && 'table-hover',
      size && `table-${size}`,
      className
    ].filter(Boolean).join(' ');
  }, [striped, hover, size, className]);

  const tableContent = (
    <table className={tableClasses}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              style={{ width: column.width, cursor: 'pointer' }}
              className={column.headerClassName}
              onClick={() => {
                setSortConfig({
                  key: column.key,
                  direction:
                    sortConfig.key === column.key && sortConfig.direction === 'asc'
                      ? 'desc'
                      : 'asc',
                });
              }}
            >
              {column.title}
              {sortConfig.key === column.key && (
                <span className='ms-1'>
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {currentItems.length > 0 ? (
          currentItems.map((row, rowIndex) => (
            <tr
              key={row.id ?? rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((column) => (
                <td
                  key={`${row.id ?? rowIndex}-${column.key}`}
                  className={column.cellClassName}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className='text-center'>
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  const paginationContent = data.length > 0 ? (
    <div className='d-flex justify-content-between align-items-center my-3 flex-wrap gap-2'>
      <input
        type='text'
        className='form-control w-auto'
        placeholder='Search...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="d-flex align-items-center gap-2">
        <nav>
          <ul className='pagination mb-0'>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className='page-link'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index + 1}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  className='page-link'
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className='page-link'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>

        <select
          className='form-select w-auto'
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          {pageSizeOptions.map(option => (
            <option key={option} value={option}>
               {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  ) : null;

  if (isLoading) {
    return (
      <div className='d-flex justify-content-center p-4'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  return responsive ? (
    <div>
      {paginationContent}
      <div className='table-responsive'>{tableContent}</div>
    </div>
  ) : (
    <div>
      {paginationContent}
      {tableContent}
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      width: PropTypes.string,
      render: PropTypes.func,
      headerClassName: PropTypes.string,
      cellClassName: PropTypes.string
    })
  ).isRequired,
  onRowClick: PropTypes.func,
  isLoading: PropTypes.bool,
  striped: PropTypes.bool,
  hover: PropTypes.bool,
  responsive: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  emptyMessage: PropTypes.string,
  className: PropTypes.string,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number)
};

export default Table;
