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
];
export default columns;
