import { Table, Pagination, Skeleton } from "antd";

const CallsTable = ({
  dataSource,
  columns,
  currentPage,
  limit,
  totalItems,
  handlePageChange,
  loading,
}) => {
  const skeletonColumns = columns.map((col, idx) => ({
    ...col,
    render: () => (
      <Skeleton.Input style={{ width: 120 }} key={idx} active size="small" />
    ),
  }));

  const skeletonData = Array.from({ length: limit }).map((_, index) => ({
    key: index,
  }));

  return (
    <>
    {/* Overflow Table to make it mobile friendly */}
      <div className="w-full overflow-x-auto bg-white">
        <Table
          dataSource={loading ? skeletonData : dataSource}
          columns={loading ? skeletonColumns : columns}
          pagination={false}
          rowKey={loading ? "key" : "id"}
        />
      </div>
      {!loading && (
        <div className="mt-4 w-full flex flex-col items-center">
          <Pagination
            current={currentPage}
            pageSize={limit}
            total={totalItems}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
          <br />
          <p className="-mt-2 text-sm">
            {(currentPage - 1) * limit + 1} -{" "}
            {Math.min(currentPage * limit, totalItems)} of {totalItems}
          </p>
        </div>
      )}
    </>
  );
};

export default CallsTable;
