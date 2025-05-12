// "ETH/USD,USD/EUR,USD/JPY,BTC/USD,EUR/USD,ETH/BTC,ETH/XRP,ETH/USD,XAU/USD",
// BTC/USD,EUR/USD,USD/JPY,ETH/BTC,
// "ETH/USD,USD/EUR,ETH/XRP,ETH/USD,XAU/USD",

import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Styled components for styling the card
const CardContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const PriceCard = styled.div`
  padding: 10px;
  border-radius: 5px;
  background-color: #f4f4f8;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 200px;
`;

const Symbol = styled.div`
  font-weight: bold;
  font-size: 1.2em;
`;

const Price = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  color: ${(props) => (props.isIncreasing ? "green" : "red")};
`;

const LivePriceCard = () => {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const apiKey = "887b21c85e464ee4844b6a3853db80b6";
    const route = "quotes/price";
    const url = `wss://ws.twelvedata.com/v1/${route}?apikey=${apiKey}`;

    let ws = new WebSocket(url);

    var symbols =
      "ETH/USD,USD/EUR,USD/JPY,BTC/USD,EUR/USD,ETH/BTC,ETH/XRP,ETH/USD,XAU/USD";

    const subscribeToSymbols = () => {
      ws.send(
        JSON.stringify({
          action: "subscribe",
          params: {
            symbols: symbols,
          },
        })
      );
    };

    const reconnectWebSocket = () => {
      ws = new WebSocket(url);
      ws.onopen = () => {
        subscribeToSymbols();
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data && data.symbol && data.price) {
          setPrices((prevPrices) => {
            const prevPriceData = prevPrices[data.symbol] || {};
            const isIncreasing = data.price > (prevPriceData.price || 0);

            return {
              ...prevPrices,
              [data.symbol]: {
                price: data.price,
                previousPrice: prevPriceData.price || data.price,
                change: data.change,
                percentChange: data.percent_change,
                isIncreasing: isIncreasing,
              },
            };
          });
        }
      };

      ws.onerror = (error) => {
        console.log("WebSocket Error:", error);
      };

      ws.onclose = () => {
        // Reconnect after 3 seconds
        setTimeout(reconnectWebSocket, 3000);
      };
    };

    reconnectWebSocket(); // Initial WebSocket connection

    return () => {
      ws.close();
    };
  }, []);
  var symbols =
    "ETH/USD,USD/EUR,USD/JPY,BTC/USD,EUR/USD,ETH/BTC,ETH/XRP,ETH/USD,XAU/USD";

  const renderPriceCards = () => {
    // Split the symbols  manda pover each to render a price card
    return symbols.split(",").map((symbol) => {
      const priceData = prices[symbol];

      if (!priceData) return null;

      return (
        <div className="price-card" key={symbol}>
          <PriceCard>
            <Symbol>{symbol}</Symbol>
            <Price isIncreasing={priceData.isIncreasing}>
              {priceData.price}
            </Price>
          </PriceCard>
        </div>
      );
    });
  };

  return <CardContainer>{renderPriceCards()}</CardContainer>;
};

export default LivePriceCard;
