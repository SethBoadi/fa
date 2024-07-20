// kraken.js  
const axios = require('axios');  
const crypto = require('crypto');  
const querystring = require('querystring');  

const API_KEY = 'oildollar'; // Replace with your actual API key  
const API_SECRET = 'iQIzBAABCAAdFiEEPupNg1gu2wWnBIG0o4BC9gfWI9oFAmaZn38ACgkQo4BC9gfWI9oX7BAArSFZ9zjyhgx3yA4ByrkNNU6tyzpnhguRjazPpbm+ksF+retpc7XUy55hbEtVHqlgbbiec/vrogkhN1G4RBjDTTSQ+Al35rWbCtf0LX+f9j8BtIyG2L+6SGVVSpnfE/EF6p3l7cZSDN6JZHDy44HKm+NgS84Ziw2nd1tnykz1ANaerhb9LSUhu+PWO6jccqcrFhsD3Y/N4fjD2XbhQWMoeNId2kaH2qB6nmlnz7MAAdFy01ccg7Hilm7BBEItWpPUjdHVuewo9oBrv4E3Sc6sS75ZW4oqKVYsEFo7o1htfW8cub9g3tv47o9M8p6PhzUBBw3RtLSnGnorw99oicVuAsaPlw/9sv7PRSKd2Hnj6piOBjpQbqbm6bkUmPipXzMDTj5RoyxntuK1iw7um5VI8KBe4vJNE2+/vhu8Xk3VRd0P2HQnqLgwXqSu3Hv19v/H8yFqZELcAjJBR047GWhhmutX/WZzZNFfG2mgpLa4wMoWLTE11DWPAOGkxw4Om1HqZaSntIoVdsBFdrYL2zvhXxe8CwVnz0e4L2OGeDx/AP74BB5vOG2LQaIOzEau7lUweiQDi7MfcVyNzn7TvBYEQB1qnxc0+Wk+Iq/jITYwjBug6Iycr1YszR/QSwttoBiiXLkgTXoGBPtGJZRcGidyQPVb0ZMVWOuou6+8eXfs6L4==z9jP'; // Replace with your actual API secret  
const BASE_URL = 'https://api.kraken.com';  

function getSignature(path, request, nonce) {  
    const message = querystring.stringify(request);  
    const secret_buffer = Buffer.from(API_SECRET, 'base64');  
    const hash = crypto.createHash('sha256');  
    const hmac = crypto.createHmac('sha512', secret_buffer);  
    const hash_digest = hash.update(nonce + message).digest('binary');  
    return hmac.update(path + hash_digest, 'binary').digest('base64');  
}  

async function getTicker(pair) {  
    try {  
        const response = await axios.get(`${BASE_URL}/0/public/Ticker`, {  
            params: { pair }  
        });  
        return response.data.result[pair];  
    } catch (error) {  
        console.error('Error fetching ticker:', error);  
        throw error;  
    }  
}  

async function createOrder(pair, type, ordertype, volume) {  
    const path = '/0/private/AddOrder';  
    const nonce = Date.now() * 1000;  
    const request = { nonce, pair, type, ordertype, volume };  
    const signature = getSignature(path, request, nonce);  
    try {  
        const response = await axios.post(`${BASE_URL}${path}`, querystring.stringify(request), {  
            headers: {  
                'API-Key': API_KEY,  
                'API-Sign': signature,  
                'Content-Type': 'application/x-www-form-urlencoded',  
            }  
        });  
        return response.data.result;  
    } catch (error) {  
        console.error('Error creating order:', error);  
        throw error;  
    }  
}  

module.exports = { getTicker, createOrder };