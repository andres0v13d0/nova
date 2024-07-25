import React, { useState, useRef, useEffect } from "react";
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { Messages } from 'primereact/messages';
import './ShopCartStyles.css';

const ShopCart = ({ shopItems, addToCart }) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const msgs = useRef(null);

  const showDetails = (item) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    msgs.current.show({ severity: 'success', summary: 'Success', detail: `${item.name} agregado al carrito`, life: 3000 });
  };

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return null;
    }
  };

  const itemTemplate = (data) => {
    return (
      <div className="product-item">
        <div className="product-img">
          <img src={data.cover} alt={data.name} />
        </div>
        <div className="product-info">
          <div className="detalles-producto">
            <h3>{data.name}</h3>
            <span className="product-price">${data.price}</span>
          </div>
          <div className="product-actions">
            <Button icon="pi pi-shopping-cart" label="Agregar" onClick={() => handleAddToCart(data)} disabled={data.inventoryStatus === 'OUTOFSTOCK'}></Button>
            <Button icon="pi pi-search" label="Detalles" onClick={() => showDetails(data)} className="p-button-info" />
          </div>
          <Tag value={data.inventoryStatus} severity={getSeverity(data)}></Tag>
        </div>
      </div>
    );
  };

  return (
    <>
      <Messages ref={msgs} />
      <div className="card">
        <DataScroller value={shopItems} itemTemplate={itemTemplate} rows={5} buffer={0.4} inline scrollHeight="500px" />
      </div>
      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        {selectedItem && (
          <>
            <h2>{selectedItem.name}</h2>
            <img src={selectedItem.cover} alt={selectedItem.name} style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }} />
            <p><strong>Precio:</strong> ${selectedItem.price}</p>
            <p><strong>Descripción:</strong> {selectedItem.description}</p>
            <p><strong>Categoría:</strong> {selectedItem.category}</p>
            <p><strong>Descuento:</strong> 0%</p>
            <p><strong>Disponible:</strong> {selectedItem.stock > 0 ? 'Sí' : 'No'}</p>
            {/* Agrega aquí más atributos del producto según sea necesario */}
          </>
        )}
      </Sidebar>
    </>
  );
};

export default ShopCart;
