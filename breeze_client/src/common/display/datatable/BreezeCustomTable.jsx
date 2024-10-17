import PropTypes from 'prop-types';
// import { useState, useEffect } from 'react';

const CustomTable = ({
  // resource,
  // fields,
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
  // const [data, setData] = useState(passedData || []);
  // const [columns, setColumns] = useState(passedColumns || []);

  // useEffect(() => {
  //   if (resource && fields) {
  //     async function fetchResourceData() {
  //       const queryParams = new URLSearchParams();
  //       fields.forEach((field) => queryParams.append('fields', field));

  //       const response = await fetch(`http://localhost:8000/editor/resource/${resource}/?${queryParams.toString()}`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       const fetchedData = await response.json();
  //       setData(fetchedData);

  //       const fetchedColumns = fields.map((field) => ({
  //         header: field.charAt(0).toUpperCase() + field.slice(1),
  //         accessor: field,
  //       }));
  //       setColumns(fetchedColumns);
  //     }

  //     fetchResourceData();
  //   }
  // }, [resource, fields]);

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
              <tr key={item.id || rowIndex} className={rowClass}>
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
                    {column.render ? column.render(item[column.accessor]) : item[column.accessor]}
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
          className="btn br-text-primary med-font"
          style={{ border: '0' }}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <i className="bi bi-chevron-left" style={{ fontSize: '12px' }}></i>
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.max(1, Math.ceil((data?.length || 0) / pageSize))}
        </span>
        <button
          className="btn br-text-primary med-font"
          style={{ border: '0' }}
          disabled={currentPage * pageSize >= data?.length}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <i className="bi bi-chevron-right" style={{ fontSize: '12px' }}></i>
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
