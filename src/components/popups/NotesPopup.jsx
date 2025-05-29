const NotesPopup = ({ callData, notes, onNotesChange, onClose, onSave }) => {
  return (
    <div className="w-full h-screen bg-black/30 fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-primary hover:text-primary/70 text-2xl"
        >
          &times;
        </button>

        <div className="px-6 pt-4">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-lg">Add Notes</h2>
            <p className="text-sm text-primary break-all">
              Call ID {callData?.id}
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-black/30"></div>

        <div className="p-6 space-y-4 w-2/3 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="text-sm font-medium">Call Type</div>
            <div className="text-primary">
              {callData?.call_type === "voicemail"
                ? "Voice Mail"
                : callData?.call_type}
            </div>

            <div className="text-sm font-medium">Duration</div>
            <div>{callData?.formatted_duration}</div>

            <div className="text-sm font-medium">From</div>
            <div>{callData?.from}</div>

            <div className="text-sm font-medium">To</div>
            <div>{callData?.to}</div>

            <div className="text-sm font-medium">Via</div>
            <div>{callData?.via}</div>
          </div>
        </div>

        <div className="px-6">
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Add Notes"
              className="w-full border border-gray-300 rounded-lg p-2 min-h-[100px] resize-none"
            />
          </div>
        </div>

        <div className="w-full h-[1px] bg-black/30"></div>
        <div className="px-6 pb-4">
          <button
            onClick={onSave}
            className="mt-4 w-full bg-primary cursor-pointer text-white py-2 rounded hover:bg-primary-dark"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesPopup;
