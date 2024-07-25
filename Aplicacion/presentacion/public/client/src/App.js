import React, { useState, useEffect, createContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./common/header/Header";
import Pages from "./pages/Pages";
import Data from "./components/Data";
import Cart from "./common/Cart/Cart";
import Footer from "./common/footer/Footer";
import obtenerProductos from "./components/shops/Sdata";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/Checkout";
import Componentes from "./pages/Componentes";  // Importa tu componente
import Perifericos from "./pages/Perifericos";  // Importa tu componente
import Monitores from "./pages/Monitores";  // Importa tu componente
import PCs from "./pages/PCs";  // Importa tu componente
import Laptops from "./pages/Laptops";  // Importa tu componente
import Consolas from "./pages/Consolas";  // Importa tu componente
import Conocenos from "./pages/Conocenos";  // Importa tu componente

// Define y exporta MyContext
export const MyContext = createContext();

function App() {
  const { productItems } = Data;
  const [shopItems, setShopItems] = useState([]);
  const [CartItem, setCartItem] = useState([]);
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);
  const [alertBox, setAlertBox] = useState({ open: false, error: false, msg: '' });
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const productos = await obtenerProductos();
      setShopItems(productos);
    };
    fetchData();
  }, []);

  const addToCart = (product) => {
    const productExit = CartItem.find((item) => item.id === product.id);
    if (productExit) {
      setCartItem(CartItem.map((item) =>
        item.id === product.id ? { ...productExit, qty: productExit.qty + 1 } : item
      ));
    } else {
      setCartItem([...CartItem, { ...product, qty: 1 }]);
    }
  };

  const decreaseQty = (product) => {
    const productExit = CartItem.find((item) => item.id === product.id);
    if (productExit.qty === 1) {
      setCartItem(CartItem.filter((item) => item.id !== product.id));
    } else {
      setCartItem(CartItem.map((item) =>
        item.id === product.id ? { ...productExit, qty: productExit.qty - 1 } : item
      ));
    }
  };

  return (
    <MyContext.Provider value={{
      isHeaderFooterShow,
      setisHeaderFooterShow,
      alertBox,
      setAlertBox,
      isLogin,
      setIsLogin
    }}>
      <Router>
        {isHeaderFooterShow && <Header CartItem={CartItem} setProductos={setShopItems} />}
        <Switch>
          <Route path='/login' exact>
            <Login />
          </Route>
          <Route path='/register' exact>
            <Register />
          </Route>
          <Route path='/forgot-password' exact>
            <ForgotPassword />
          </Route>
          <Route path='/reset-password' exact>
            <ResetPassword />
          </Route>
          <Route path='/checkout' exact>
            <Checkout />
          </Route>
          <Route path='/componentes' exact>
            <Componentes />
          </Route>
          <Route path='/perifericos' exact>
            <Perifericos />
          </Route>
          <Route path='/monitores' exact>
            <Monitores />
          </Route>
          <Route path='/pcs' exact>
            <PCs />
          </Route>
          <Route path='/laptops' exact>
            <Laptops />
          </Route>
          <Route path='/consolas' exact>
            <Consolas />
          </Route>
          <Route path='/conocenos' exact>
            <Conocenos />
          </Route>
          <Route path='/' exact>
            <Pages productItems={productItems} addToCart={addToCart} shopItems={shopItems} />
          </Route>
          <Route path='/cart' exact>
            <Cart CartItem={CartItem} addToCart={addToCart} decreaseQty={decreaseQty} />
          </Route>
        </Switch>
        {isHeaderFooterShow && <Footer />}
      </Router>
    </MyContext.Provider>
  );
}

export default App;
