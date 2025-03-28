const db = require("../Backend/App/Models")
const forexlivedata = db.forexlivedata

module.exports = function (app, io) {
    const WebSocket = require('ws');
    // Replace 'YOUR_API_KEY' with your actual Tiingo API key
    // const API_KEY = 'bfb6173acfc17ce2afbc73a44015944789678341';
    const API_KEY = '6c89bf7d4e3c6d0e1eff47ad7c8f8b5781ee990b';


    const forexSocket = () => {

        const ws = new WebSocket('wss://api.tiingo.com/fx');
        ws.on('open', function open() {

            // Subscribe to a currency pair
            const subscribeMessage = {
                eventName: 'subscribe',
                authorization: API_KEY,
                eventData: {
                    thresholdLevel: 5,  // You can set this to 1, 5, 10, etc. based on your needs
                    //tickers: ['eurusd', 'gbpusd', 'jpyusd']

                    tickers: [
                        'eurusd',
                        'jpyusd',
                        'usdjpy',
                        'gbpusd',
                        'audusd',
                        'usdcad',
                        'usdchf',
                        'nzdusd',
                        'eurjpy',
                        'gbpjpy',
                        'eurgbp',
                        'audjpy',
                        'euraud',
                        'eurchf',
                        'audnzd',
                        'nzdjpy',
                        'gbpaud',
                        'gbpcad',
                        'eurnzd',
                        'audcad',
                        'gbpchf'
                      ]
                      
                }
            };

            ws.send(JSON.stringify(subscribeMessage));
        });

        ws.on('message',async function incoming(data) {
            const response = JSON.parse(data);
            if (response.messageType == "A") {

                if (response.data != undefined && response.data.length > 0) {
                    if (response.data[0] == "Q") {
                        // let token = response.data[1];
                        // let price = response.data[5];
                        const filter = { token: response.data[1] };
                        const update = {
                            $set: {
                                token:response.data[1],
                                price: response.data[5]
                            },
                        };
                        // const result = await stock_live_price.updateOne(filter, update, { upsert: true });
                        await forexlivedata.updateOne(filter, update, { upsert: true });

                
                        
                    }

                 
                    // Create a new Date object from the UTC time string
                    const utcDate = new Date(response.data[2]);
                    const istTime = new Date(utcDate.getTime());

                    // Format the IST time to a readable string
                    const options = {
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        fractionalSecondDigits: 3
                    };
                    const formatter = new Intl.DateTimeFormat('en-GB', options);
                    const formattedISTTime = formatter.format(istTime);
                 
                }
            }
        });

        ws.on('close', function close() {
            console.log('Disconnected from Tiingo FX WebSocket');
        });

        ws.on('error', function error(err) {
            console.error('WebSocket error:', err);
        });
    }



    const cryptoSocket = () => {
        const ws = new WebSocket('wss://api.tiingo.com/crypto');
        ws.on('open', function open() {

            // Subscribe to a currency pair
            const subscribeMessage = {
                eventName: 'subscribe',
                authorization: API_KEY,
                eventData: {
                    thresholdLevel: 2,  // You can set this to 1, 5, 10, etc. based on your needs
                    //tickers: ['btcusd'] // Replace with the ticker(s) you want to subscribe to
                    tickers: [
                        'usdtusd',
                        'btcxrp',
                        'btcusd',
                        'ethxrp',
                        'ethusd',
                        'usdcusd',
                        'solusd',
                        'solbtc',
                        'bnbbtc',
                        'xrpusd',
                        'daiusd',
                        'dogeusd'
                      ]
                }
            };

            ws.send(JSON.stringify(subscribeMessage));
        });

        ws.on('message', async function incoming(data) {
            const response = JSON.parse(data);
            if (response.messageType == "A") {

                if (response.data != undefined && response.data.length > 0) {
                    if (response.data[0] == "Q") {
                       
                        const filter = { token: response.data[1] };
                        const update = {
                            $set: {
                                token:response.data[1],
                                price: response.data[6]
                            },
                        };
                        // const result = await stock_live_price.updateOne(filter, update, { upsert: true });
                        await forexlivedata.updateOne(filter, update, { upsert: true });

                       // io.emit("receive_data_forex", {data:response.data , type:'crypto'});
                    }
            
                    // Create a new Date object from the UTC time string
                    const utcDate = new Date(response.data[2]);
                    const istTime = new Date(utcDate.getTime());

                    // Format the IST time to a readable string
                    const options = {
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        fractionalSecondDigits: 3
                    };
                    const formatter = new Intl.DateTimeFormat('en-GB', options);
                    const formattedISTTime = formatter.format(istTime);
                  
                }
            }
        });

        ws.on('close', function close() {
        });

        ws.on('error', function error(err) {
            console.error('WebSocket error:', err);
        });
    }

    async function startForexSocket() {
        forexSocket();
        cryptoSocket();
    }

    startForexSocket()
}
