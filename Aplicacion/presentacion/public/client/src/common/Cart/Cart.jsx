import React, { useState, useEffect } from "react";
import "./style.css";
import { useHistory, useLocation } from "react-router-dom";
import VerificationModal from '../../pages/VerificationModal';

const Cart = ({ CartItem, addToCart, decreaseQty }) => {
  const history = useHistory();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);

  const totalPrice = CartItem.reduce((price, item) => price + item.qty * item.price, 0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const showModal = params.get('showModal');
    const pedidoId = params.get('pedidoId');
    if (showModal === 'true') {
      setShowModal(true);
      setPedidoId(pedidoId);
    }
  }, [location]);

  const handleCheckout = async () => {
    try {
      const carritos = CartItem.map(carrito => ({
        nombre: carrito.name,
        productoid: carrito.id,
        precio: carrito.price,
        cantidad: carrito.qty
      }));

      const response = await fetch('http://localhost:3200/ventas/crear-pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ carrito: carritos })
      });

      const data = await response.json();
      if (data.success && data.url) {
        setPedidoId(data.pedidoId);
        window.location.href = data.url;
      } else if (!data.success && data.pedidoId) {
        alert('No se pudo redirigir a PayPal. Intente nuevamente.');
      } else {
        throw new Error('Error al crear el pedido: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <>
      <section className='cart-items'>
        <div className='container d_flex'>
          <div className='cart-details'>
            {CartItem.length === 0 && <h1 className='no-items product'>No hay productos agregados</h1>}

            {CartItem.map((item) => {
              const productQty = item.price * item.qty;

              return (
                <div className='cart-list product d_flex' key={item.id}>
                  <div className='img'>
                    <img src={item.cover} alt='' />
                  </div>
                  <div className='cart-details'>
                    <h3>{item.name}</h3>
                    <h4>
                      ${item.price} * {item.qty}
                      <span>${productQty}</span>
                    </h4>
                  </div>
                  <div className='cart-items-function'>
                    <div className='removeCart'>
                      <button className='removeCart'>
                        <i className='fa-solid fa-xmark'></i>
                      </button>
                    </div>
                    <div className='cartControl d_flex'>
                      <button className='incCart' onClick={() => addToCart(item)}>
                        <i className='fa-solid fa-plus'></i>
                      </button>
                      <button className='desCart' onClick={() => decreaseQty(item)}>
                        <i className='fa-solid fa-minus'></i>
                      </button>
                    </div>
                  </div>
                  <div className='cart-item-price'></div>
                </div>
              );
            })}
          </div>

          <div className='cart-total product'>
            <h2>Detalles de compra</h2>
            <div className='d_flex'>
              <h4>Precio Total :</h4>
              <h3 className='price-text'>${totalPrice}</h3>
            </div>
            <div className="button-group">
              <button className="checkout-button" onClick={handleCheckout}>
                Pagar
              </button>
              <button className="continue-shopping-button" onClick={() => history.push('/')}>
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </section>
      {showModal && <VerificationModal email={localStorage.getItem('email')} onClose={() => setShowModal(false)} isForRegistration={false} pedidoId={pedidoId} />}
    </>
  );
};

export default Cart;
