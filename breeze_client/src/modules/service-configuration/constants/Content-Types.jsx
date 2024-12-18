export const RAW_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'JSON', label: 'application/json' },
  // { value: 'XML', label: 'application/xml' },
  // { value: 'TEXT', label: 'text/plain' },
  // { value: 'XML', label: 'text/xml' },
  // { value: 'JAVASCRIPT', label: 'application/javascript' },
  // { value: 'HTML', label: 'text/html' },
];

export const URLENCODED_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'URLENCODED', label: 'application/x-www-form-urlencoded' },
];

export const FORMDATA_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'FORMDATA', label: 'multipart/form-data' },
];

export const BINARY_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'OCTET_STREAM', label: 'application/octet-stream' },
  { value: 'PDF', label: 'application/pdf' },
  { value: 'ZIP', label: 'application/zip' },
  { value: 'PNG', label: 'image/png' },
  { value: 'JPEG', label: 'image/jpeg' },
  { value: 'MP4', label: 'video/mp4' },
  { value: 'AUDIO', label: 'audio/mpeg' },
];

export const TEXT_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'TEXT', label: 'text/plain' },
  { value: 'HTML', label: 'text/html' },
  { value: 'CSV', label: 'text/csv' },
  { value: 'XML', label: 'text/xml' },
  { value: 'JAVASCRIPT', label: 'text/javascript' },
];

export const FILE_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'FORMDATA', label: 'multipart/form-data' },
  // { value: 'OCTET_STREAM', label: 'application/octet-stream' },
  // { value: 'PDF', label: 'application/pdf' },
  // { value: 'PNG', label: 'image/png' },
  // { value: 'JPEG', label: 'image/jpeg' },
];

export const RESPONSE_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'JSON', label: 'JSON (application/json)' },
  // { value: 'XML', label: 'XML (application/xml)' },
  // { value: 'HTML', label: 'HTML (text/html)' },
  // { value: 'TEXT', label: 'Plain Text (text/plain)' },
  // { value: 'PDF', label: 'PDF (application/pdf)' },
  // { value: 'OCTET_STREAM', label: 'Binary (application/octet-stream)' },
  // { value: 'FORMDATA', label: 'Multipart Form Data (multipart/form-data)' },
  // { value: 'PNG', label: 'Image PNG (image/png)' },
  // { value: 'JPEG', label: 'Image JPEG (image/jpeg)' },
  // { value: 'MP4', label: 'Video MP4 (video/mp4)' },
  // { value: 'MPEG', label: 'Audio MPEG (audio/mpeg)' },
];

export const STATUS_CODES = [
  { label: 'Select', value: '' },
  { label: '200', value: 'S_200' }, // OK
  { label: '201', value: 'S_201' }, // Created
  { label: '204', value: 'S_204' }, // No Content
  { label: '400', value: 'S_400' }, // Bad Request
  { label: '401', value: 'S_401' }, // Unauthorized
  { label: '403', value: 'S_403' }, // Forbidden
  { label: '404', value: 'S_404' }, // Not Found
  { label: '405', value: 'S_405' }, // Method Not Allowed
  { label: '408', value: 'S_408' }, // Request Timeout
  { label: '409', value: 'S_409' }, // Conflict
  { label: '410', value: 'S_410' }, // Gone
  { label: '500', value: 'S_500' }, // Internal Server Error
  { label: '502', value: 'S_502' }, // Bad Gateway
  { label: '503', value: 'S_503' }, // Service Unavailable
  { label: '504', value: 'S_504' }, // Gateway Timeout
];
