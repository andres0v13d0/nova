import React, { useEffect, useState } from "react";
import Home from "../components/MainPage/Home";
import Shop from "../components/shops/Shop";
import Annocument from "../components/annocument/Annocument";
import Wrapper from "../components/wrapper/Wrapper";
import VerificationModal from "./VerificationModal";

const Pages = ({ productItems, addToCart, CartItem, shopItems }) => {
  const [showModal, setShowModal] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const pedidoId = urlParams.get('pedidoId');

    if (paymentStatus === 'success') {
      setPedidoId(pedidoId);
      setShowModal(true);
    }
  }, []);

  return (
    <>
      <Home CartItem={CartItem} />
      <Shop shopItems={shopItems} addToCart={addToCart} />
      <Annocument />
      <Wrapper />
      {showModal && (
        <VerificationModal 
          operation="feedback" 
          pedidoId={pedidoId} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

export default Pages;
