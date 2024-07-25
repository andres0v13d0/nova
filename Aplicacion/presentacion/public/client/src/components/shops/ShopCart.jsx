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
                <img src={shopItem.cover} alt={shopItem.name} />
              </div>
              <div className='product-details'>
                <h3>{shopItem.name}</h3>
                <div className='price'>
                  <h4>${shopItem.price}</h4>
                  <button onClick={() => addToCart(shopItem)}>
                    <i className='fa fa-plus'></i>
                  </button>
                  <Button icon="pi pi-info" onClick={() => showDetails(shopItem)} className="p-button-info" />
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
            <p><strong>Precio:</strong> ${selectedItem.price}</p>
            <p><strong>Descripción:</strong> {selectedItem.description}</p>
            <p><strong>Categoría:</strong> {selectedItem.category}</p>
            <p><strong>Descuento:</strong> {selectedItem.discount}%</p>
            <p><strong>Disponible:</strong> {selectedItem.stock > 0 ? 'Sí' : 'No'}</p>
            <p><strong>ID del Producto:</strong> {selectedItem.id}</p>
            {/* Agrega aquí más atributos del producto según sea necesario */}
          </>
        )}
      </Sidebar>
    </>
  );
};

export default ShopCart;
