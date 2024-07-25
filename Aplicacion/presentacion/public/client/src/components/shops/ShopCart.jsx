import React, { useState, useRef } from "react";
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { Messages } from 'primereact/messages';
import './ShopCartStyles.css';

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
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
          <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={data.cover} alt={data.name} />
          <div className="flex flex-column lg:flex-row justify-content-between align-items-center xl:align-items-start lg:flex-1 gap-4">
            <div className="flex flex-column align-items-center lg:align-items-start gap-3">
              <div className="flex flex-column gap-1">
                <div className="text-2xl font-bold text-900">{data.name}</div>
                <div className="text-700">{data.description}</div>
              </div>
              <div className="flex flex-column gap-2">
                <Rating value={data.rating} readOnly cancel={false}></Rating>
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-tag product-category-icon"></i>
                  <span className="font-semibold">{data.category}</span>
                </span>
              </div>
            </div>
            <div className="flex flex-row lg:flex-column align-items-center lg:align-items-end gap-4 lg:gap-2">
              <span className="text-2xl font-semibold">${data.price}</span>
              <Button icon="pi pi-shopping-cart" label="Add to Cart" onClick={() => handleAddToCart(data)} disabled={data.inventoryStatus === 'OUTOFSTOCK'}></Button>
              <Button icon="pi pi-info" label="Detalles" onClick={() => showDetails(data)} className="p-button-info" />
              <Tag value={data.inventoryStatus} severity={getSeverity(data)}></Tag>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Messages ref={msgs} />
      <div className="card">
        <DataScroller value={shopItems} itemTemplate={itemTemplate} rows={5} buffer={0.4} header="Lista de Productos" />
      </div>
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
