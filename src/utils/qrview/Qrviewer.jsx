"use client"
import React, { useRef } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

const QRViewer = () => {
    const qrRef = useRef(null);

    const downloadQR = () => {
        const qrElement = qrRef.current;
        html2canvas(qrElement).then((canvas) => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "qr-code.png";
            link.click();
        });
    };

    return (
        <div className="space-y-4">
            <div ref={qrRef} className="p-4 bg-white">
                <QRCode value={'https://www.facebook.com/olloo.mn'} />
            </div>
            <div className="two-line">
                <button className="px-3" type="button" onClick={downloadQR} style={{ color: "blue" }}>
                    Татах
                </button>
            </div>
        </div>
    );
};

export default QRViewer;
