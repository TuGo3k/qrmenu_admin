import React, { useRef } from "react";
import QRCode from "react-qr-code";

const QrSeeModal = ({ closeModal, tableId, merchantId }) => {
  const qrRef = useRef(null);

  const downloadQR = () => {
    const qrElement = qrRef.current;
    const svg = qrElement.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "qr-code.png";
      link.click();
    };

    img.src = url;
  };

  const qrUrl = `http://192.168.1.98:3000/table/${tableId}/${merchantId}`;

  return (
    <div className="blur_container">
      <div className="modal">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">QR харах</h2>
          <h2
            style={{ cursor: "pointer" }}
            onClick={closeModal}
            align="right"
            className="text-2xl font-semibold text-red-700"
          >
            X
          </h2>
        </div>
        <div className="space-y-4">
          <div ref={qrRef} className="p-4 bg-white">
            <QRCode value={qrUrl} />
          </div>
          <div className="two-line">
            <button
              className="px-3 cursor-pointer"
              type="button"
              onClick={downloadQR}
              style={{ color: "blue" }}
            >
              Download
            </button>
            <button
              className="px-3 cursor-pointer"
              type="button"
              onClick={closeModal}
              style={{ color: "red" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrSeeModal;
