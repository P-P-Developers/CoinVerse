const axios = require('axios');

const data = 'DTime:1748428620|Symbol:BANKNIFTY|TType:LE|Tr_Price:0.00000000|Price:335.65|Sq_Value:0.00000000|Sl_Value:0.00|TSL:0.00|Segment:O|Strike:55300|OType:PUT|Expiry:29052025|Strategy:test|Quntity:30|Key:EQY28022025|TradeType:MT_4|Demo:demo';

const config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://app.equityresearchmart.in/signal/broker-signals',
  headers: {
    'Content-Type': 'text/plain',
  },
  data: data,
};

// Utility to sleep
const wait = ms => new Promise(res => setTimeout(res, ms));

// Fire in controlled parallel batches
async function sendInBatches(total = 1000, batchSize = 10, delay = 200) {
  for (let i = 0; i < total; i += batchSize) {
    const batch = Array.from({ length: batchSize }).map(() => axios(config));
    const results = await Promise.allSettled(batch);
    results.forEach((res, idx) => {
      if (res.status === 'fulfilled') {
        console.log(`✅ Success ${i + idx + 1}`, res.value.data);
      } else {
        console.log(`❌ Failed ${i + idx + 1}`, res.reason?.message || res.reason);
      }
    });
    await wait(delay); // optional delay between batches
  }
}

sendInBatches(); // run it
