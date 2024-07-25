import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Select, MenuItem } from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";

const QRModal = ({ open, onClose, onScanSuccess }) => {
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      populateCameraOptions();
    } else {
      stopQrCodeScanner();
    }
    return () => {
      stopQrCodeScanner();
    };
  }, [open]);

  const populateCameraOptions = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      setCameraDevices(devices);
      if (devices.length > 0) {
        setSelectedCamera(devices[0].id);
        startQrCodeScanner(devices[0].id);
      }
    } catch (error) {
      setError("Error al obtener dispositivos de cámara.");
      console.error("Error al obtener dispositivos de cámara:", error);
    }
  };

  const startQrCodeScanner = (cameraId) => {
    if (html5QrCode) {
      html5QrCode.stop().then(() => {
        initiateQrCodeScanner(cameraId);
      }).catch(err => {
        setError(`Error al detener el escáner QR: ${err}`);
        console.log(`Error al detener el escáner QR: ${err}`);
      });
    } else {
      initiateQrCodeScanner(cameraId);
    }
  };

  const initiateQrCodeScanner = (cameraId) => {
    const qrCodeScanner = new Html5Qrcode("qr-reader");
    qrCodeScanner.start(
      { deviceId: cameraId },
      { fps: 10, qrbox: 250 },
      (qrCodeMessage) => {
        handleQrCodeScanned(qrCodeMessage);
      },
      (errorMessage) => {
        console.log(`QR Code no escaneado. Error: ${errorMessage}`);
      }
    ).catch(err => {
      setError(`Error en el escaneo QR: ${err}`);
      console.log(`Error en el escaneo QR: ${err}`);
    });

    setHtml5QrCode(qrCodeScanner);
  };

  const handleQrCodeScanned = (qrCodeMessage) => {
    const nombreEmpresa = qrCodeMessage.split(": ")[1];
    onScanSuccess(nombreEmpresa);
    onClose();
  };

  const stopQrCodeScanner = () => {
    if (html5QrCode) {
      html5QrCode.stop().then(() => {
        setHtml5QrCode(null);
      }).catch(err => {
        setError(`Error al detener el escáner QR: ${err}`);
        console.log(`Error al detener el escáner QR: ${err}`);
      });
    }
  };

  const handleChangeCamera = (event) => {
    const cameraId = event.target.value;
    setSelectedCamera(cameraId);
    startQrCodeScanner(cameraId);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4, backgroundColor: 'white', margin: 'auto', width: '50%' }}>
        <Typography variant="h6" gutterBottom>
          Marcar Pedido como Recibido
        </Typography>
        <Select value={selectedCamera} onChange={handleChangeCamera}>
          {cameraDevices.map((device) => (
            <MenuItem key={device.id} value={device.id}>
              {device.label}
            </MenuItem>
          ))}
        </Select>
        <Box id="qr-reader" sx={{ width: 500, marginTop: 2 }}></Box>
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Modal>
  );
};

export default QRModal;
