import React from "react"
import "./style.css"

const Wrapper = () => {
  const data = [
    {
      cover: <i class='fa-solid fa-id-card'></i>,
      title: "Pago Seguro",
      decs: "Ofrecemos precios competitivos en nuestra amplia gama de productos tecnológicos.",
    },
    {
      cover: <i class='fa-solid fa-shield'></i>,
      title: "Compra con Confianza",
      decs: "Garantizamos productos de calidad y soporte especializado en tecnología.",
    },
    {
      cover: <i class='fa-solid fa-headset'></i>,
      title: "Soporte 24/7",
      decs: "Brindamos asistencia continua para resolver tus dudas y problemas técnicos.",
    },
  ]
  return (
    <>
      <section className='wrapper background'>
        <div className='container grid2'>
          {data.map((val, index) => {
            return (
              <div className='product' key={index}>
                <div className='img icon-circle'>
                  <i>{val.cover}</i>
                </div>
                <h3>{val.title}</h3>
                <p>{val.decs}</p>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default Wrapper
