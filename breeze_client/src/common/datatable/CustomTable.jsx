import PropTypes from 'prop-types';

const CustomTable = ({
  columns,
  data,
  actions,
  tableClass = 'table table-bordered table-dark table-responsive',
  headerClass = 'text-center',
  rowClass = 'text-center',
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  sortBy,
  sortDirection = 'asc',
  onSort,
  filters = {},
  onFilterChange,
  onRowSelect,
  selectedRows = [],
}) => {
  const handleSort = (column) => {
    const direction = sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column, direction);
  };

  const handleFilterChange = (column, value) => {
    onFilterChange(column, value);
  };

  const handleRowSelect = (item) => {
    onRowSelect(item);
  };

  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <table className={tableClass}>
        <thead>
          <tr className={headerClass}>
            {onRowSelect && <th>Select</th>}
            {columns.map((column, index) => (
              <th
                key={index}
                style={{ width: column.width || 'auto', cursor: 'pointer' }}
                onClick={() => handleSort(column.accessor)}
              >
                {column.header}
                {sortBy === column.accessor && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
          {/* Filters row */}
          <tr>
            {onRowSelect && <td></td>}
            {columns.map((column, index) => (
              <td key={index}>
                {filters[column.accessor] &&
                  (column.filterType === 'select' ? (
                    <select
                      value={filters[column.accessor]}
                      onChange={(e) => handleFilterChange(column.accessor, e.target.value)}
                    >
                      {column.filterOptions.map((option, i) => (
                        <option key={i} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={filters[column.accessor]}
                      onChange={(e) => handleFilterChange(column.accessor, e.target.value)}
                    />
                  ))}
              </td>
            ))}
            {actions && <td></td>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, rowIndex) => (
              <tr key={rowIndex} className={rowClass}>
                {onRowSelect && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item)}
                      onChange={() => handleRowSelect(item)}
                    />
                  </td>
                )}
                {columns.map((column, colIndex) => (
                  <td key={colIndex} title={column.tooltip ? column.tooltip(item) : ''}>
                    {column.render ? column.render(item[column.accessor], item) : item[column.accessor]}
                  </td>
                ))}
                {actions && <td>{actions(item)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0) + (onRowSelect ? 1 : 0)} className="text-center">
                ---- No data found ----
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="pagination-controls d-flex justify-content-between align-items-center">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(data.length / pageSize)}
        </span>
        <button
          className="btn btn-secondary"
          disabled={currentPage * pageSize >= data.length}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

CustomTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      width: PropTypes.string,
      tooltip: PropTypes.func,
      filterType: PropTypes.oneOf(['text', 'select']),
      filterOptions: PropTypes.arrayOf(PropTypes.string),
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.func,
  tableClass: PropTypes.string,
  headerClass: PropTypes.string,
  rowClass: PropTypes.string,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  onSort: PropTypes.func,
  filters: PropTypes.object,
  onFilterChange: PropTypes.func,
  onRowSelect: PropTypes.func,
  selectedRows: PropTypes.arrayOf(PropTypes.object),
};

export default CustomTable;
