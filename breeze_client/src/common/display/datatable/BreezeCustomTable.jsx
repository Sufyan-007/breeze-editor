import PropTypes from 'prop-types';
const CustomTable = ({
  columns,
  data,
  actions,
  tableClass = 'table table-bordered table-dark table-responsive',
  headerClass = 'text-center',
  rowClass = 'text-center',
  headerDataClass = 'br-background-primary br-text-primary',
  cellDataClass = 'br-background-primary br-text-primary',
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  sortBy,
  sortDirection = 'asc',
  onSort,
  onRowSelect,
  selectedRows = [],
  actionPlacement = null,
}) => {
  const handleSort = (column) => {
    const direction = sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort && onSort(column, direction);
  };

  const handleRowSelect = (item) => {
    onRowSelect && onRowSelect(item);
  };

  const paginatedData = data?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <table className={tableClass}>
        <thead>
          <tr className={headerClass}>
            {onRowSelect && <th>Select</th>}
            {actionPlacement === 'start' || actionPlacement === 'both' ? (
              <th className={headerDataClass}>Actions</th>
            ) : null}
            {columns.map((column, index) => (
              <th
                className={headerDataClass}
                key={index}
                style={{
                  width: column.width || 'auto',
                  cursor: onSort ? 'pointer' : 'default',
                  textAlign: column.align || 'left',
                }}
                onClick={onSort ? () => handleSort(column.accessor) : undefined}
              >
                {column.headerRenderer ? column.headerRenderer() : column.header}
                {onSort && sortBy === column.accessor && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
            {actionPlacement === 'end' || actionPlacement === 'both' ? (
              <th className={headerDataClass}>Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {paginatedData?.length > 0 ? (
            paginatedData?.map((item, rowIndex) => (
              <tr key={rowIndex} className={rowClass}>
                {onRowSelect && (
                  <td className={cellDataClass}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item)}
                      onChange={() => handleRowSelect(item)}
                    />
                  </td>
                )}
                {actionPlacement === 'start' || actionPlacement === 'both' ? <td>{actions && actions(item)}</td> : null}
                {columns.map((column, colIndex) => (
                  <td className={cellDataClass} key={colIndex} style={{ textAlign: column.align || 'left' }}>
                    {column.render ? column.render(item[column.accessor], item) : item[column.accessor]}
                  </td>
                ))}
                {actionPlacement === 'end' || actionPlacement === 'both' ? (
                  <td className={cellDataClass}>{actions && actions(item)}</td>
                ) : null}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0) + (onRowSelect ? 1 : 0)}
                className={`text-center ${cellDataClass}`}
              >
                ---- No data found ----
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination-controls d-flex justify-content-between align-items-center">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(data?.length || 0 / pageSize)}
        </span>
        <button
          className="btn btn-secondary"
          disabled={currentPage * pageSize >= data?.length || 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

CustomTable.propTypes = {
  resource: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.string),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      width: PropTypes.string,
      filterType: PropTypes.oneOf(['text', 'select']),
      filterOptions: PropTypes.arrayOf(PropTypes.string),
      render: PropTypes.func,
    })
  ),
  data: PropTypes.arrayOf(PropTypes.object),
  actions: PropTypes.func,
  tableClass: PropTypes.string,
  headerClass: PropTypes.string,
  rowClass: PropTypes.string,
  cellDataClass: PropTypes.string,
  headerDataClass: PropTypes.string,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  onSort: PropTypes.func,
  onRowSelect: PropTypes.func,
  selectedRows: PropTypes.arrayOf(PropTypes.object),
  actionPlacement: PropTypes.oneOf(['start', 'end', 'both']),
};

export default CustomTable;
