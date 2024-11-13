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

const Change = styled.div`
  color: ${(props) => (props.change >= 0 ? "green" : "red")};
`;

const LivePriceCard = () => {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const apiKey = "887b21c85e464ee4844b6a3853db80b6";
    const route = "quotes/price";
    const url = `wss://ws.twelvedata.com/v1/${route}?apikey=${apiKey}`;
    
    const ws = new WebSocket(url);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          action: "subscribe",
          params: {
            symbols:
              "BTC/USD,EUR/USD,USD/JPY,ETH/BTC", // Add or remove symbols as needed
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data && data.symbol && data.price) {
        console.log(data);

        setPrices((prevPrices) => {
          const prevPriceData = prevPrices[data.symbol] || {};
          const isIncreasing = data.price > (prevPriceData.price || 0);

          return {
            ...prevPrices,
            [data.symbol]: {
              price: data.price,
              previousPrice: prevPriceData.price || data.price, // Set initial previous price to current if not set
              change: data.change,
              percentChange: data.percent_change,
              isIncreasing: isIncreasing,
            },
          };
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const renderPriceCard = (symbol) => {
    const priceData = prices[symbol];
    
    if (!priceData) return null;

    return (
        
      <div className="price-card">
        <PriceCard key={symbol}>
        <Symbol>{symbol}</Symbol>
        <Price isIncreasing={priceData.isIncreasing}>{priceData.price}</Price>
        {/* <Change change={priceData.change}> */}
          {/* {priceData.change >= 0 ? "+" : ""} */}
          {/* {priceData.change} ({priceData.percentChange}%) */}
        {/* </Change> */}
      </PriceCard>
      </div>

    );
  };

  return (
    <CardContainer>
      {renderPriceCard("BTC/USD")}
      {renderPriceCard("EUR/USD")}
      {renderPriceCard("USD/JPY")}
      {renderPriceCard("ETH/BTC")}
    </CardContainer>
  );
};

export default LivePriceCard;
