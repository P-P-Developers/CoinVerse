const WebSocket = require("ws");
const axios = require("axios");

class DeribitOptionsTracker {
  constructor() {
    this.optionChain = {}; // expiry -> strike -> type
    this.btcUsdPrice = null;
    this.ws = null;
    this.onDataUpdate = null;
  }

  /** ---------- Utility Functions ---------- **/
  parseExpiryDate(expiryStr) {
    const day = parseInt(expiryStr.substring(0, 2));
    const monthStr = expiryStr.substring(2, 5);
    const year = parseInt("20" + expiryStr.substring(5, 7));

    const monthMap = {
      JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
      JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
    };

    return new Date(year, monthMap[monthStr], day);
  }

  parseInstrument(instrumentName) {
    const parts = instrumentName.split("-");
    if (parts.length !== 4) return null;
    return {
      expiry: parts[1],
      strike: parseFloat(parts[2]),
      type: parts[3], // C or P
    };
  }

  /** ---------- Emit Single Update ---------- **/
  triggerUpdateSingle(instrumentData) {
    if (this.onDataUpdate && this.btcUsdPrice && instrumentData) {
      const now = new Date();
      const curtime = now.toTimeString().slice(0, 5).replace(":", "");

      const obj = {
        ticker: instrumentData.instrument,
        Ask_Price: (instrumentData.ask || instrumentData.mark) * this.btcUsdPrice,
        Bid_Price: (instrumentData.bid || instrumentData.mark) * this.btcUsdPrice,
        Mid_Price: instrumentData.mark * this.btcUsdPrice,
        Date: now.toISOString(),
        curtime,
        expiry: instrumentData.expiry,
      };

      this.onDataUpdate(obj); // send one object at a time
    }
  }

  onUpdate(callback) {
    this.onDataUpdate = callback;
  }

  /** ---------- Start & Stop ---------- **/
  async start(callback) {
    if (callback) this.onUpdate(callback);

    try {
      // 1. Fetch instruments
      const { data } = await axios.get(
        "https://www.deribit.com/api/v2/public/get_instruments?currency=BTC&kind=option&expired=false"
      );

      let instruments = data.result.map((inst) => inst.instrument_name);

      // 2. Take only nearest expiry (avoid too much load)
      const expiryDates = [
        ...new Set(instruments.map((i) => i.split("-")[1]).filter(Boolean)),
      ];
      const nearest = expiryDates[0];
      console.log("Using expiry:", nearest);

      // 3. Filter instruments for nearest expiry
      instruments = instruments.filter((i) => i.includes(nearest));

      // 4. Init optionChain expiry-wise
      instruments.forEach((inst) => {
        const parsed = this.parseInstrument(inst);
        if (!parsed) return;

        const optionType = parsed.type.toLowerCase();
        this.optionChain[parsed.expiry] ??= {};
        this.optionChain[parsed.expiry][parsed.strike] ??= {};
        this.optionChain[parsed.expiry][parsed.strike][optionType] = {
          instrument: inst,
          expiry: parsed.expiry,
          mark: null,
          bid: null,
          ask: null,
          iv: null,
        };
      });

      // 5. WebSocket setup
      this.ws = new WebSocket("wss://www.deribit.com/ws/api/v2");

      this.ws.on("open", () => {
        const sub = (channels, id) => ({
          jsonrpc: "2.0",
          id,
          method: "public/subscribe",
          params: { channels },
        });

        this.ws.send(
          JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "public/hello",
            params: { client_name: "options-tracker", client_version: "1.0" },
          })
        );
        this.ws.send(
          JSON.stringify({
            jsonrpc: "2.0",
            id: 2,
            method: "public/set_heartbeat",
            params: { interval: 30 },
          })
        );

        // Subscribe BTC spot price
        this.ws.send(JSON.stringify(sub(["ticker.BTC-PERPETUAL.100ms"], 3)));

        // Subscribe to instruments (chunked)
        const tickerCh = instruments.map((i) => `ticker.${i}.100ms`);
        const bookCh = instruments.map((i) => `book.${i}.100ms`);
        const chunkSize = 50;

        [tickerCh, bookCh].forEach((channels, baseId) => {
          for (let i = 0; i < channels.length; i += chunkSize) {
            this.ws.send(
              JSON.stringify(
                sub(channels.slice(i, i + chunkSize), baseId * 100 + i)
              )
            );
          }
        });
      });

      this.ws.on("message", (raw) => {
        let msg;
        try {
          msg = JSON.parse(raw);
        } catch {
          return;
        }
        if (!msg.params) return;
        const { channel, data } = msg.params;

        // BTC price updates
        if (channel === "ticker.BTC-PERPETUAL.100ms") {
          this.btcUsdPrice = data.last_price;
          return;
        }

        // Option ticker updates
        if (channel?.startsWith("ticker.BTC-") && !channel.includes("PERPETUAL")) {
          const parsed = this.parseInstrument(data.instrument_name);
          if (parsed) {
            const o =
              this.optionChain[parsed.expiry]?.[parsed.strike]?.[parsed.type.toLowerCase()];
            if (o) {
              o.mark = data.mark_price;
              o.iv = data.mark_iv;
              this.triggerUpdateSingle(o);
            }
          }
        }

        // Order book updates
        if (channel?.startsWith("book.BTC-")) {
          const parsed = this.parseInstrument(channel.split(".")[1]);
          if (parsed) {
            const o =
              this.optionChain[parsed.expiry]?.[parsed.strike]?.[parsed.type.toLowerCase()];
            if (o) {
              o.bid = data.bids?.[0]?.[0] || null;
              o.ask = data.asks?.[0]?.[0] || null;
              this.triggerUpdateSingle(o);
            }
          }
        }
      });

      this.ws.on("error", (err) =>
        console.error("WebSocket error:", err.message)
      );

      this.ws.on("close", () => {
        console.log("WebSocket closed, reconnecting...");
        this.stop();
        setTimeout(() => this.start(this.onDataUpdate), 5000);
      });
    } catch (err) {
      console.error("Error starting tracker:", err.message);
    }
  }

  stop() {
    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws.close();
      this.ws = null;
    }
    this.optionChain = {};
  }
}

module.exports = DeribitOptionsTracker;
