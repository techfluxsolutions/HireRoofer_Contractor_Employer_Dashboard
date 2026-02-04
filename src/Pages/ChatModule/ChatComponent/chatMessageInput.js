// ============================================
// FILE: components/ChatMessageInput.jsx
// ============================================
import React from 'react';

export const ChatMessageInput = ({ messageHandlers, socketConnected }) => {
  const {
    newMessage,
    selectedFile,
    previewUrl,
    uploading,
    handleInputChange,
    handleFileSelect,
    sendMessage,
    setSelectedFile,
    setPreviewUrl,
  } = messageHandlers;

  const getFileIcon = (file) => {
    const type = file.type;
    if (type.includes('presentation')) return '📊';
    if (type.includes('spreadsheet')) return '📈';
    if (type.includes('word')) return '📄';
    if (type === 'application/pdf') return '📕';
    if (type.startsWith('audio')) return '🎵';
    if (type.startsWith('video')) return '🎬';
    return '📁';
  };

  return (
    <div className="border-t p-3 flex flex-col gap-2">
      {selectedFile && (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 w-fit">
          {previewUrl &&
            previewUrl !== 'file' &&
            selectedFile.type.startsWith('image') && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-24 rounded-lg"
              />
            )}

          {selectedFile.type === 'application/pdf' && (
            <iframe
              src={previewUrl}
              className="w-40 h-32 border rounded"
              title="PDF Preview"
            />
          )}

          {!selectedFile.type.startsWith('image') &&
            selectedFile.type !== 'application/pdf' && (
              <div className="flex items-center gap-2">
                <span className="text-3xl">{getFileIcon(selectedFile)}</span>
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}

          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
            className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="file"
          id="fileInput"
          hidden
          onChange={handleFileSelect}
        />

        <button
          type="button"
          onClick={() => document.getElementById('fileInput').click()}
          className="text-xl px-2 hover:bg-gray-100 rounded"
          disabled={uploading}
        >
          📎
        </button>

        <input
          value={newMessage}
          onChange={handleInputChange}
          placeholder={
            socketConnected ? 'Type a message' : 'Connecting to server...'
          }
          disabled={!socketConnected || uploading}
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={sendMessage}
          disabled={uploading || !socketConnected}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  );
};
