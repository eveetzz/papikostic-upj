import React from "react";
import { Document, Page, PDFViewer, View } from "@react-pdf/renderer";
import { X } from "lucide-react";

export const PreviewPDF = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[#1A5A9A] w-full max-w-6xl h-[90vh] rounded-xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-1 border-b">
          <h2 className="text-white font-medium">Pratinjau Laporan</h2>
          <button
            onClick={onClose}
            className="p-2"
          >
            <X className="w-6 h-6 text-white hover:text-red-400" />
          </button>
        </div>

        <div className="flex-1 w-full">
          {/* Di sini, dia akan merender apa pun yang kamu lempar ke dalam Modal */}
          <PDFViewer width="100%" height="100%">
            {children}
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};
