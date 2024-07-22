const express = require('express');
const router = express.Router();
const paypal = require('paypal-rest-sdk');
const ventasService = require('../../logica/services/ventasService');
const authService = require('../../logica/services/authService');
const config = require('./tokenPayPal');

paypal.configure({
    'mode': config.paypal.mode,
    'client_id': config.paypal.client_id,
    'client_secret': config.paypal.client_secret
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
                "return_url": `http://localhost:3200/ventas/pago-exitoso?pedidoId=${pedido.pedidoid}`,
                "cancel_url": `http://localhost:3200/ventas/pago-cancelado?pedidoId=${pedido.pedidoid}`
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
                res.status(500).json({ success: false, error: error.message, pedidoId: pedido.pedidoid });
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        return res.json({ success: true, url: payment.links[i].href, pedidoId: pedido.pedidoid });
                    }
                }
                res.status(500).json({ success: false, error: 'No se encontró la URL de aprobación', pedidoId: pedido.pedidoid });
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/pago-exitoso', async (req, res) => {
    const { PayerID, paymentId, pedidoId } = req.query;

    const execute_payment_json = {
        "payer_id": PayerID
    };

    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
            console.error(error.response);
            res.redirect(`http://localhost:3000/cart?payment=cancelled&pedidoId=${pedidoId}`);
        } else {
            try {
                await ventasService.registrarVenta(pedidoId);
                res.redirect(`http://localhost:3000/?payment=success&pedidoId=${pedidoId}`);
            } catch (error) {
                res.status(500).json({ success: false, error: 'Error registrando la venta: ' + error.message });
                res.redirect(`http://localhost:3000/cart?payment=cancelled&pedidoId=${pedidoId}`);
            }
        }
    });
});

router.get('/pago-cancelado', (req, res) => {
    const { pedidoId } = req.query;
    
    res.redirect(`http://localhost:3000/cart?payment=cancelled&pedidoId=${pedidoId}`);
});

module.exports = router;
