import React from "react"
import "./style.css"

const Footer = () => {
  return (
    <>
      <footer>
        <div className='container grid2'>
          <div className='box'>
            <h1>NovaTech</h1>
            <p>Tienda especializada en la venta de computadoras y periféricos electrónicos. Ofrecemos una amplia gama de productos de alta calidad, incluyendo laptops, desktops, monitores, teclados, ratones, impresoras y accesorios.</p>
            <div className='icon d_flex'>
             
            </div>
          </div>

          <div className='box'>
           
          </div>
          <div className='box'>
            <h2>Atención al Cliente</h2>
            <ul>
              <li>Centro de Ayuda</li>
              <li>Cómo Comprar</li>
              <li>Compras Corporativas y al por Mayor</li>
              <li>Devoluciones & Reembolsos</li>
            </ul>
          </div>
          <div className='box'>
            <h2>Contactos</h2>
            <ul>
              <li>Av. Daniel León Borja 456, Edificio Plaza Central, Local 12,</li>
              <li>Riobamba, Chimborazo, Ecuador</li>
              <li>Correo Electronico: novatech@gmail.com</li>
              <li>Telefono: +593 969 232 1232</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer