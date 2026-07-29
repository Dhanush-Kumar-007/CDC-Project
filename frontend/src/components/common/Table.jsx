/**
 * Usage:
 *   <Table
 *     columns={[{ key: 'name', label: 'Name' }, { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} /> }]}
 *     data={rows}
 *     keyField="_id"
 *   />
 */
const Table = ({ columns, data, keyField = '_id', emptyMessage = 'No records found' }) => {
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-10">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto -mx-5">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((row) => (
            <tr key={row[keyField]} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
