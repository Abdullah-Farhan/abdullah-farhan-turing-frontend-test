import { Table, Pagination } from "antd";

const CallsTable = ({
  dataSource,
  columns,
  currentPage,
  limit,
  totalItems,
  handlePageChange,
}) => {
  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false} 
        rowKey="id"
      />
      <div className="mt-4 w-full flex flex-col items-center">
        <Pagination
          current={currentPage}
          pageSize={limit}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
        <br />
        <p className="-mt-2 text-sm">{(currentPage-1) * 10 +1} - {currentPage*10} of {totalItems}</p>
      </div>
    </>
  );
};

export default CallsTable;
