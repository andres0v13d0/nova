import React, { useState } from "react";

const ShopCart = ({ shopItems, addToCart }) => {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(count + 1);
  };

  return (
    <>
      {shopItems.length > 0 ? (
        shopItems.map((shopItem, index) => (
          <div className='box' key={index}>
            <div className='product mtop'>
              <div className='img'>
                <img src={shopItem.cover} alt='' />
                <div className='product-like'>
                  <label>{count}</label> <br />
                  <i className='fa-regular fa-heart' onClick={increment}></i>
                </div>
              </div>
              <div className='product-details'>
                <h3>{shopItem.name}</h3>
                <div className='price'>
                  <h4>${shopItem.price}.00 </h4>
                  <button onClick={() => addToCart(shopItem)}>
                    <i className='fa fa-plus'></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No hay productos disponibles</p>
      )}
    </>
  );
};

export default ShopCart;
