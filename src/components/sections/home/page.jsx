"use client";

import useCallStore from "@/services/call.service";
import { useEffect, useState } from "react";
import CallsTable from "@/components/tables/CallsTable";
import NotesPopup from "@/components/popups/NotesPopup";
import getColumns from "@/utils/callsTableColumns";
import Cookies from "js-cookie";

const Page = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const { getCallsData } = useCallStore();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const tableData = useCallStore((state) => state.callsData);
  const totalItems = useCallStore((state) => state.totalCount);
  const [isNotesPopupOpen, setIsNotesPopupOpen] = useState(false);
  const [selectedCallData, setSelectedCallData] = useState(null);
  const [newNote, setNewNote] = useState("");
  const token = Cookies.get("access_token");

  const fetchCallData = async (page = 1) => {
    const offset = (page - 1) * limit;
    await getCallsData(offset, limit)
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (token) {
      fetchCallData(currentPage);
    }
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredData = tableData.filter((item) => {
    if (selectedFilter === "archived") return item.is_archived === true;
    if (selectedFilter === "unarchived") return item.is_archived === false;
    return true; // no filter applied, show all
  });
  

  const columns = getColumns(setSelectedCallData, setIsNotesPopupOpen);

  return (
    <div>
      <h1 className="text-lg md:text-3xl font-semibold">
        Turing Technologies Frontend Test
      </h1>

      {/* Filters */}
      <div className="flex space-x-2 items-center mt-8">
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
      />

      {/* Notes Popup */}
      {isNotesPopupOpen && (
        <NotesPopup
          callData={selectedCallData}
          notes={newNote}
          onNotesChange={(e) => setNewNote(e.target.value)}
          onClose={() => setIsNotesPopupOpen(false)}
          onSave={() => {
            console.log("Save clicked for call:", selectedCallData);
            setIsNotesPopupOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Page;
