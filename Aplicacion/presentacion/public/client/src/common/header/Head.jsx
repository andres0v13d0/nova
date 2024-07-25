import React, { useContext } from "react";
import { MyContext } from '../../App';


const Head = () => {
  const { user } = useContext(MyContext);

  return (
    <>
      <section className='head'>
        <div className='container d_flex'>
          <div className='left row'>
            <i className='fa fa-phone'></i>
            <label> +593 969 232 1232</label>
            <i className='fa fa-envelope'></i>
            <label> novatech@gmail.com</label>
          </div>
          <div className='right row RText'>
            <label>¿Necesitas Ayuda?</label>
            {user && <label>{user.name}</label>}
          </div>
        </div>
      </section>
    </>
  );
};

export default Head;
