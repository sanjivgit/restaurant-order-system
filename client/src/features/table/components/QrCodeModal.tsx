"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Link2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Table } from "@/types";

export const getTableQrUrl = (table: Table): string => {
  if (table.qrCodeUrl) return table.qrCodeUrl;
  if (typeof window !== "undefined") {
    return `${window.location.origin}/r/${table.branchId}/${table.id}/menu`;
  }
  return "";
};

const QrCodeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
}> = ({ isOpen, onClose, table }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const url = table ? getTableQrUrl(table) : "";

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${(table?.tableNumber || "table").replace(/\s+/g, "-").toLowerCase()}-qr.png`;
    link.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`QR code · ${table?.tableNumber ?? ""}`} size="sm">
      {table && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-box border border-base-300 bg-white p-4">
            <QRCodeCanvas
              ref={canvasRef}
              value={url}
              size={200}
              level="M"
              marginSize={1}
              bgColor="#ffffff"
              fgColor="#1a1a1a"
            />
          </div>

          <p className="text-sm text-base-content/60">Scan to open the menu at {table.tableNumber}.</p>

          <div className="w-full flex items-center gap-2 rounded-field border border-base-300 bg-base-200 px-3 py-2">
            <Link2 className="size-3.5 shrink-0 text-base-content/40" />
            <span className="text-xs text-base-content/70 truncate">{url}</span>
          </div>

          <Button fullWidth icon={<Download className="size-4" />} onClick={handleDownload}>
            Download QR code
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default QrCodeModal;
