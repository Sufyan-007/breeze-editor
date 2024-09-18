const treeData = [
  {
    id: 1,
    name: 'node modules',
  },
  {
    id: 2,
    name: 'public',
  },
  {
    id: 3,
    name: 'src',
    children: [
      {
        id: 31,
        name: 'components',
        children: [
          { id: 311, name: 'Main.jsx' },
          { id: 312, name: 'Form.jsx' },
        ],
      },
      {
        id: 32,
        name: 'pages',
        children: [
          { id: 321, name: 'Home.jsx' },
          { id: 322, name: 'Dashboard.jsx' },
        ],
      },
      {
        id: 33,
        name: 'Main.jsx',
      },
      {
        id: 34,
        name: 'app.css',
      },
    ],
  },
  {
    id: 4,
    name: 'package-lock.json',
  },
  {
    id: 5,
    name: 'package.json',
  },
  {
    id: 6,
    name: 'tpconfig.json'
  }
];

export default treeData;
