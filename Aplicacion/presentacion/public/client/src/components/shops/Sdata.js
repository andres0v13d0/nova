const obtenerProductos = async () => {
  try {
    const response = await fetch('http://localhost:3200/catalogo/productos');
    
    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
    }

    const productos = await response.json();
    console.log('Respuesta del servidor:', productos); // Imprimir la respuesta completa para depuración

    const shopItems = productos.map(producto => ({
      id: producto.productoid,
      cover: producto.imagen ? `data:image/png;base64,${producto.imagen}` : 'default-image-path', // Ajusta la ruta de la imagen por defecto si `imagen` es null
      name: producto.nombre,
      price: producto.precio, // Ajusta este campo según sea necesario
    }));
    

    return shopItems;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
};

export default obtenerProductos;
