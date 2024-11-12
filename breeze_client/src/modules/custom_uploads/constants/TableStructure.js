const columns = [
  {
    header: 'File Name',
    accessor: 'fileName',
    width: '40%',
  },
  {
    header: 'Last Modified',
    accessor: 'lastModified',
    render: (value) => new Date(value).toLocaleDateString(),
    width: '40%',
  },
  {
    header: 'Actions',
    accessfor: 'actions',
    width: '20%',
    align: 'right',
    headerRenderer: () => <div style={{ display: 'flex', justifyContent: 'space-between' }}>Actions</div>,
  },
];
export default columns;
