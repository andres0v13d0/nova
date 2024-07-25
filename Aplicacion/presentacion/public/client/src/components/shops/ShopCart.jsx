import React, { useState } from "react";
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

const ShopCart = ({ shopItems, addToCart }) => {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const increment = () => {
    setCount(count + 1);
  };

  const showDetails = (item) => {
    setSelectedItem(item);
    setVisible(true);
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
                  <h4>${shopItem.price} </h4>
                  <button onClick={() => addToCart(shopItem)}>
                    <i className='fa fa-plus'></i>
                  </button>
                  <Button icon="pi pi-info" label="Detalles" onClick={() => showDetails(shopItem)} className="p-button-info" />
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No hay productos disponibles</p>
      )}
      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        {selectedItem && (
          <>
            <h2>{selectedItem.name}</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </>
        )}
      </Sidebar>
    </>
  );
};

export default ShopCart;
