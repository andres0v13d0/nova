import React from "react";
import "./style.css";
import { useHistory } from "react-router-dom";

const Cart = ({ CartItem, addToCart, decreaseQty }) => {
  const history = useHistory();

  // Step: 7 Calculate total of items
  const totalPrice = CartItem.reduce((price, item) => price + item.qty * item.price, 0);

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
                      ${item.price}.00 * {item.qty}
                      <span>${productQty}.00</span>
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
              <h3 className='price-text'>${totalPrice}.00</h3>
            </div>
            <div className="button-group">
              <button className="checkout-button" onClick={() => history.push('/checkout')}>
                Pagar
              </button>
              <button className="continue-shopping-button" onClick={() => history.push('/')}>
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;