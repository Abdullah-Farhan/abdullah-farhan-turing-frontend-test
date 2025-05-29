"use client";

import useCallStore from "@/services/call.service";
import { useEffect, useRef, useState } from "react";
import CallsTable from "@/components/tables/CallsTable";
import NotesPopup from "@/components/popups/NotesPopup";
import getColumns from "@/utils/callsTableColumns";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Pusher from "pusher-js";
import useAuthStore from "@/services/auth.service";

const Page = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const { getCallsData, updateStatus, addNote } = useCallStore();
  const { generateNewToken } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const tableData = useCallStore((state) => state.callsData);
  const totalItems = useCallStore((state) => state.totalCount);
  const [isNotesPopupOpen, setIsNotesPopupOpen] = useState(false);
  const [selectedCallData, setSelectedCallData] = useState(null);
  const [newNote, setNewNote] = useState("");
  const loading = useCallStore((state) => state.loading);
  const pusherRef = useRef(null);

  const fetchCallData = async (page = 1) => {
    const offset = (page - 1) * limit;
    await getCallsData(offset, limit)
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchCallData();

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    const authEndpoint = process.env.NEXT_PUBLIC_APP_AUTH_ENDPOINT;
    const accessToken = Cookies.get("access_token");

    const pusher = new Pusher(pusherKey, {
      cluster,
      authEndpoint,
      auth: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const channel = pusher.subscribe(process.env.NEXT_PUBLIC_MY_CHANNEL);

    channel.bind(process.env.NEXT_PUBLIC_PUSHER_EVENT, () => {
      fetchCallData();
    });

    pusherRef.current = pusher;

    return () => {
      if (pusherRef.current) {
        pusherRef.current.unsubscribe(process.env.NEXT_PUBLIC_MY_CHANNEL);
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const checkTokenInterval = setInterval(() => {
      const token = Cookies.get("access_token");
      if (token) {
        fetchCallData(currentPage);
        clearInterval(checkTokenInterval);
      }
    }, 100);

    return () => clearInterval(checkTokenInterval);
  }, [currentPage]);

  // generating new token before token expires (every 9 minutes)
  useEffect(() => {
    const tokenRefreshInterval = setInterval(() => {
      generateNewToken();
    }, 9 * 60 * 1000);

    return () => clearInterval(tokenRefreshInterval);
  }, [generateNewToken]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // filtering based on status is_archived (true/false)
  const filteredData = tableData?.filter((item) => {
    if (selectedFilter === "archived") return item.is_archived === true;
    if (selectedFilter === "unarchived") return item.is_archived === false;
    return true;
  });

  // columns template for antd table 
  const columns = getColumns(
    setSelectedCallData,
    setIsNotesPopupOpen,
    updateStatus
  );

  const handleNoteAdd = async () => {
    if (selectedCallData && newNote.trim()) {
      const res = await addNote(selectedCallData.id, newNote);
      if (res?.status === 201) {
        toast.success("Note Added Successfully.");
        fetchCallData(currentPage);
      }
      setIsNotesPopupOpen(false);
      setNewNote("");
    }
  };

  return (
    <div>
      <h1 className="text-lg md:text-3xl font-semibold">
        Turing Technologies Frontend Test
      </h1>

      {/* Filters */}
      <div className="flex space-x-2 items-center mt-8 mb-6">
        <h2>Filter By:</h2>
        <select
          name="filters"
          id="filters"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="text-primary focus:text-black focus:outline-none rounded px-2 py-1"
        >
          <option value="">Status</option>
          <option value="archived">Archived</option>
          <option value="unarchived">Unarchive</option>
        </select>
      </div>

      {/* Table with Pagination */}
      <CallsTable
        dataSource={filteredData}
        columns={columns}
        currentPage={currentPage}
        limit={limit}
        totalItems={totalItems}
        handlePageChange={handlePageChange}
        loading={loading}
      />

      {/* Notes Popup */}
      {isNotesPopupOpen && (
        <NotesPopup
          callData={selectedCallData}
          notes={newNote}
          onNotesChange={(e) => setNewNote(e)}
          onClose={() => setIsNotesPopupOpen(false)}
          onSave={() => handleNoteAdd()}
        />
      )}
    </div>
  );
};

export default Page;
