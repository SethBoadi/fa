// app.js  
const express = require('express');  
const { getTicker, createOrder } = require('./kraken');  
const app = express();  

app.use(express.json());  

app.get('/api/price/btc', async (req, res) => {  
    try {  
        const ticker = await getTicker('XXBTZUSD');  
        res.json({ price: ticker.c[0] });  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to fetch BTC price' });  
    }  
});  

app.post('/api/exchange/btc', async (req, res) => {  
    const { amount } = req.body;  
    try {  
        const ticker = await getTicker('XXBTZUSD');  
        const volume = (amount / parseFloat(ticker.c[0])).toFixed(8);  
        const order = await createOrder('XXBTZUSD', 'buy', 'market', volume);  
        res.json(order);  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to create order' });  
    }  
});  

app.get('/api/price/eth', async (req, res) => {  
    try {  
        const ticker = await getTicker('XETHZUSD');  
        res.json({ price: ticker.c[0] });  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to fetch ETH price' });  
    }  
});  

app.post('/api/exchange/eth', async (req, res) => {  
    const { amount } = req.body;  
    try {  
        const ticker = await getTicker('XETHZUSD');  
        const volume = (amount / parseFloat(ticker.c[0])).toFixed(8);  
        const order = await createOrder('XETHZUSD', 'buy', 'market', volume);  
        res.json(order);  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to create order' });  
    }  
});  

const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {  
    console.log(`Server running on port ${PORT}`);  
});