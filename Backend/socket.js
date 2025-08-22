const WebSocket = require('ws');
const ws = new WebSocket('wss://www.deribit.com/ws/api/v2');


const instruments = [
  'BTC-22AUG25-110000-C',
  'BTC-22AUG25-110000-P',
  'BTC-22AUG25-111000-C',
  'BTC-22AUG25-111000-P',
  'BTC-22AUG25-112000-C',
  'BTC-22AUG25-112000-P',

  'BTC-22AUG25-113000-C',
  'BTC-22AUG25-113000-P',
  'BTC-22AUG25-114000-C',
  'BTC-22AUG25-114000-P',
  'BTC-22AUG25-115000-C',
  'BTC-22AUG25-115000-P',
  'BTC-22AUG25-116000-C',
  'BTC-22AUG25-117000-P',
  'BTC-22AUG25-117000-C',
  'BTC-22AUG25-117000-P',

];

let btcUsd = null; // will store BTC/USD price from perpetual

const sub = (channels, id) => ({
  jsonrpc: '2.0',
  id,
  method: 'public/subscribe',
  params: { channels }
});

ws.on('open', () => {
  ws.send(JSON.stringify({jsonrpc:'2.0', id:1, method:'public/hello',
    params:{client_name:'options-ws-demo', client_version:'1.0'}}));
  ws.send(JSON.stringify({jsonrpc:'2.0', id:2, method:'public/set_heartbeat',
    params:{interval:30}}));

  // Subscribe to options tickers + books
  ws.send(JSON.stringify(sub(instruments.map(i => `ticker.${i}.100ms`), 3)));
  ws.send(JSON.stringify(sub(instruments.map(i => `book.${i}.100ms`), 4)));

  // Subscribe to BTC perpetual to get USD price
  ws.send(JSON.stringify(sub([`ticker.BTC-PERPETUAL.100ms`], 5)));
});

ws.on('message', (raw) => {
  const msg = JSON.parse(raw);
  if (msg.params && msg.params.channel) {
    const ch = msg.params.channel;
    const data = msg.params.data;

    // Capture BTC/USD price
    if (ch.startsWith("ticker.BTC-PERPETUAL")) {
      btcUsd = data.last_price; // USD price of 1 BTC
   
    }

    // Option tickers
    if (ch.startsWith('ticker.BTC-')) {
      const markBtc = data.mark_price;
      const markUsd = btcUsd ? markBtc * btcUsd : null;
      console.log('OPTION TICKER', data.instrument_name, {
        mark_btc: markBtc,
        mark_usd: markUsd,
        iv: data.mark_iv,
        greeks: data.greeks
      });
    }
  }
});
