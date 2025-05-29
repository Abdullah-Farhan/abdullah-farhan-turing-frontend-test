import { formatDate } from "./dateFormatter";
import { formatDuration } from "./timeFormatter";
import { Popover } from "antd";

const getColumns = (
  setSelectedCallData,
  setIsNotesPopupOpen,
  updateStatus
) => [
  {
    title: "Call Type",
    dataIndex: "call_type",
    key: "callType",
    render: (value) => {
      if (value === "voicemail") {
        return <span className="text-primary">Voice Mail</span>;
      }
      if (value === "answered") {
        return <span className="text-green-700">Answered</span>;
      }
      if (value === "missed") {
        return <span className="text-red-700">Missed</span>;
      }
      return value;
    },
  },
  {
    title: "Direction",
    dataIndex: "direction",
    key: "direction",
    render: (direction) => (
      <p className="text-primary">
        {direction === "inbound" ? "Inbound" : "Outbound"}
      </p>
    ),
  },
  {
    title: "Duration",
    dataIndex: "duration",
    key: "duration",
    render: (duration) => (
      <>
        <div>{formatDuration(duration)}</div>
        <p className="text-primary">({duration} seconds)</p>
      </>
    ),
  },
  {
    title: "From",
    dataIndex: "from",
    key: "from",
  },
  {
    title: "To",
    dataIndex: "to",
    key: "to",
  },
  {
    title: "Via",
    dataIndex: "via",
    key: "via",
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "createdAt",
    render: (value) => formatDate(value),
  },
  {
    title: "Status",
    dataIndex: "is_archived",
    key: "status",
    render: (status, record) => (
      <Popover
        content={
          <div>
            <p>Change status to {status ? "Unarchive" : "Archived"}?</p>
            <button
              className="text-primary hover:underline"
              onClick={async () => {
                await updateStatus(record.id);
              }}
            >
              Confirm
            </button>
          </div>
        }
        trigger="click"
      >
        <div
          className={`px-2 py-1 flex justify-center items-center cursor-pointer ${
            status ? "text-green-700 bg-green-100" : "text-gray-700 bg-gray-100"
          }`}
        >
          {status ? "Archived" : "Unarchive"}
        </div>
      </Popover>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <button
        onClick={() => {
          setSelectedCallData({
            ...record,
            formatted_duration: formatDuration(record.duration),
          });
          setIsNotesPopupOpen(true);
        }}
        className="bg-primary text-white px-3 py-1"
      >
        Add Note
      </button>
    ),
  },
];

export default getColumns;
