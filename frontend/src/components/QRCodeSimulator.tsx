import React, { useEffect, useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeSimulatorProps {
  onComplete: () => void;
}

export const QRCodeSimulator: React.FC<QRCodeSimulatorProps> = ({ onComplete }) => {
  const [countdown, setCountdown] = useState(3);

  // Generate transaction ID once and keep it constant during countdown
  const transactionId = useMemo(
    () => `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* QR Code with Logo */}
      <div className="bg-white rounded-xl shadow-2xl p-6 border-4 border-green-500">
        <div className="relative inline-block">
          <QRCodeSVG
            value={transactionId}
            size={256}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: '/mcd_logo.jpeg',
              x: undefined,
              y: undefined,
              height: 50,
              width: 50,
              excavate: true,
            }}
          />
        </div>
      </div>

      {/* Transaction ID */}
      <div className="text-center bg-gray-100 rounded-lg p-3 border-2 border-gray-300">
        <p className="text-xs text-gray-600">ID Transaksi:</p>
        <p className="text-sm font-mono font-bold text-gray-800">{transactionId}</p>
      </div>

      {/* Countdown Timer */}
      <div className="text-center">
        <p className="text-gray-600 mb-2">Melanjutkan dalam:</p>
        <div className="text-5xl font-bold text-green-600 animate-pulse">{countdown}</div>
      </div>

      {/* Status Text */}
      <p className="text-lg text-gray-700 font-semibold">
        {countdown > 0 ? 'Tunjukkan QR code ke mesin pembayaran' : 'Pembayaran diterima ✓'}
      </p>
    </div>
  );
};
