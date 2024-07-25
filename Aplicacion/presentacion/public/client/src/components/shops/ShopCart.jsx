import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Sidebar } from 'primereact/sidebar';
import { Messages } from 'primereact/messages';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const ShopCart = ({ shopItems, addToCart }) => {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const msgs = useRef(null);

  const increment = () => {
    setCount(count + 1);
  };

  const showDetails = (item) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const handleAddToCart = (shopItem) => {
    addToCart(shopItem);
    msgs.current.show({ severity: 'success', summary: 'Success', detail: `${shopItem.name} agregado al carrito`, life: 3000 });
  };

  const responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  const productTemplate = (shopItem) => {
    return (
      <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
        <div className="mb-3">
          <img src={shopItem.cover} alt={shopItem.name} className="w-6 shadow-2" />
        </div>
        <div>
          <h4 className="mb-1">{shopItem.name}</h4>
          <h6 className="mt-0 mb-3">${shopItem.price}</h6>
          <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
            <Button icon="pi pi-plus" onClick={() => handleAddToCart(shopItem)} />
            <Button icon="pi pi-info" onClick={() => showDetails(shopItem)} className="p-button-info" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Messages ref={msgs} />
      {shopItems.length > 0 ? (
        <div className="card">
          <Carousel value={shopItems} numVisible={3} numScroll={3} responsiveOptions={responsiveOptions} itemTemplate={productTemplate} />
        </div>
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
          </>
        )}
      </Sidebar>
    </>
  );
};

export default ShopCart;
