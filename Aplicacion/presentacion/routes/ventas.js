const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');
const ventasService = require('../../logica/services/ventasService');
const authService = require('../../logica/services/authService'); 
const usuarioService = require('../../logica/services/usuarioService'); 

paypal.configure({
    'mode': 'sandbox', 
    'client_id': 'Adui5Z3fsMKMcXpn3BFVcdQNeIqVTrPHAsNulxEeY_tPJuQZNDpTuzrZ5iDtc5s17EmSBgdsRVZ8YPnr', 
    'client_secret': 'EPQVDjhj9uLbdnw-lv-X--Ey02ou9cEo2RPygNtoRUnWhURjFokX6w5synaIRVXAZX3USsYeuikX3OzJ' 
});

router.post('/crear-pedido', async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = authService.verificarToken(token);
    const carrito = req.body.carrito;
    try {
        const pedido = await ventasService.crearPedido(decoded.usuarioid, carrito);

        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `http://localhost:3000/ventas/pago-exitoso?pedidoId=${pedido.pedidoid}`,
                "cancel_url": "http://localhost:3000/ventas/pago-cancelado"
            },
            "transactions": [{
                "item_list": {
                    "items": carrito.map(item => ({
                        "name": item.nombre,
                        "sku": item.productoid,
                        "price": item.precio.toFixed(2),
                        "currency": "USD",
                        "quantity": item.cantidad
                    }))
                },
                "amount": {
                    "currency": "USD",
                    "total": carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2)
                },
                "description": "Compra en la plataforma"
            }]
        };

        paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
                throw error;
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        res.json({ url: payment.links[i].href });
                    }
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/pago-exitoso', async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const pedidoId = req.query.pedidoId;

    const execute_payment_json = {
        "payer_id": payerId
    };

    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
            console.error(error.response);
            throw error;
        } else {
            try {
                await ventasService.registrarVenta(pedidoId);
                res.send(`
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <title>Calificar Satisfacción</title>
                    </head>
                    <body>
                        <h1>Pago completado con éxito</h1>
                        <h2>Califique su experiencia</h2>
                        <div class="form-group">
                            <label for="calificacion">Calificación:</label>
                            <input type="number" id="calificacion" min="1" max="5">
                        </div>
                        <div class="form-group">
                            <label for="comentario">Comentario:</label>
                            <textarea id="comentario"></textarea>
                        </div>
                        <button onclick="enviarFeedback(${pedidoId})">Enviar Calificación</button>
                        <div id="error-container" class="error"></div>

                        <script>
                            async function enviarFeedback(pedidoId) {
                                const calificacion = document.getElementById('calificacion').value;
                                const comentario = document.getElementById('comentario').value;
                                const errorContainer = document.getElementById('error-container');

                                try {
                                    const response = await fetch('/feedback/registrar', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ pedidoid: pedidoId, calificacion: calificacion, comentario: comentario, fecha: new Date() })
                                    });
                                    if (!response.ok) throw new Error(await response.text());
                                    alert('Feedback enviado exitosamente');
                                    window.location.href = 'http://localhost:3000/catalogo.html';
                                } catch (error) {
                                    errorContainer.textContent = error.message;
                                }
                            }
                        </script>
                    </body>
                    </html>
                `);
            } catch (error) {
                res.status(500).send('Error registrando la venta: ' + error.message);
            }
        }
    });
});

router.get('/pago-cancelado', (req, res) => {
    res.send('Pago cancelado');
});

module.exports = router;
