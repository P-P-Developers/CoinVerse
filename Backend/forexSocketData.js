
module.exports = function (app, io) {
    const WebSocket = require('ws');
    // Replace 'YOUR_API_KEY' with your actual Tiingo API key
    // const API_KEY = 'bfb6173acfc17ce2afbc73a44015944789678341';
    const API_KEY = '6c89bf7d4e3c6d0e1eff47ad7c8f8b5781ee990b';


    const forexSocket = () => {
        console.log("inside")
        const ws = new WebSocket('wss://api.tiingo.com/fx');
        ws.on('open', function open() {
            console.log('Connected to Tiingo FX WebSocket');

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
            console.log('Sent subscription message:', subscribeMessage);
        });

        ws.on('message', function incoming(data) {
            //console.log('Received:', JSON.parse(data));
            const response = JSON.parse(data);
           console.log('Received data:', response);
            if (response.messageType == "A") {

                if (response.data != undefined && response.data.length > 0) {
                    // console.log('Received data - :', response.data[0]);
                    if (response.data[0] == "Q") {
                        let token = response.data[1];
                        let price = response.data[5];


                        //io.emit("receive_data_forex", {data:response.data , type:'forex'});
                    }

                    //console.log('Received data final:', response.data[2]);
                    // UTC time string
                    //const utcTimeString = "2024-07-01T10:51:00.205000+00:00";
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
                    // console.log(formattedISTTime);
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
            console.log('Connected to Tiingo crypto WebSocket');

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
            console.log('Sent subscription message:', subscribeMessage);
        });

        ws.on('message', function incoming(data) {
            ///console.log('Received:', JSON.parse(data));
            const response = JSON.parse(data);
            //console.log('Received data:', response);
            if (response.messageType == "A") {

                if (response.data != undefined && response.data.length > 0) {
                    if (response.data[0] == "Q") {
                        let token = response.data[1];
                        let price = response.data[6];
                       // io.emit("receive_data_forex", {data:response.data , type:'crypto'});
                    }
            
                    //console.log('Received data final:', response.data[2]);
                    // UTC time string
                    //const utcTimeString = "2024-07-01T10:51:00.205000+00:00";
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
                    // console.log(formattedISTTime);
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

    async function startForexSocket() {
        forexSocket();
        cryptoSocket();
    }

    startForexSocket()
}
