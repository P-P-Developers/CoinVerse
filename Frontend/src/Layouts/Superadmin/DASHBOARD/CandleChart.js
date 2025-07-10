import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import socket from "../../../Utils/socketClient";

const LiveCandlestickChart = ({ data }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candleSeriesRef = useRef();
  const lastCandleRef = useRef(null);
  const intervalRef = useRef();

  // Create chart
  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#000",
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const candleSeries = chart.addCandlestickSeries();
    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    return () => {
      chart.remove();
      if (intervalRef.current) clearInterval(intervalRef.current);
      socket.off("receive_data_forex");
    };
  }, []);

  // Handle initial data and real-time updates
  useEffect(() => {
    if (!Array.isArray(data) || !data.length || !candleSeriesRef.current)
      return;

    const formattedData = data
      .map((item) => ({
        time: item.time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        _internal_originalTime: item.time,
      }))
      .filter((item) => !isNaN(item.time))
      .sort((a, b) => a.time - b.time);

    candleSeriesRef.current.setData(formattedData);
    lastCandleRef.current = formattedData[formattedData.length - 1];
  }, [data]);

  // Setup socket only once
  useEffect(() => {
    socket.on("receive_data_forex", (msg) => {
      const ticker = msg?.data?.ticker?.toLowerCase();
      if (ticker === "ethusd") {
        const bid = msg.data?.Bid_Price;
        const ask = msg.data?.Ask_Price;
        const mid = msg.data?.Mid_Price;
        // const time = Math.floor(new Date(msg.data?.Date).getTime() / 1000);
// Get current UTC time
const utcDate = new Date();

// Add 5 hours 30 minutes to convert to IST
const istOffsetMs = 5.5 * 60 * 60 * 1000;
const istDate = new Date(utcDate.getTime() + istOffsetMs);

// Convert to Unix timestamp (in seconds)
const time = Math.floor(istDate.getTime() / 1000);



        if (bid && ask && mid && time) {
          const last = lastCandleRef.current;

          const open = Number(mid);

          const close = open + (Math.random() * 4 - 2);

          const high = Math.max(open, close) + Math.random() * 1;

          const low = Math.min(open, close) - Math.random() * 1;

          const newCandle = {
            time,
            // open: Number(mid),
            // high: Number(bid),
            // low: Number(ask),
            // close: Number(mid),

            open: Number(open),
            high: Number(high),
            low: Number(low),
            close: Number(close),

            _internal_originalTime: time,
          };

        //   console.log("newCandle", newCandle);

          lastCandleRef.current = newCandle;
          candleSeriesRef.current.update(newCandle);
        }

        // Stop simulation if real data is flowing
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    });

    // If no real data comes in, simulate
    intervalRef.current = setInterval(() => {
      const last = lastCandleRef.current;
      if (!last || !last.time) return;

      const nextTime = last.time + 60;
      const open = last.close;
      const close = open + (Math.random() * 4 - 2);
      const high = Math.max(open, close) + Math.random();
      const low = Math.min(open, close) - Math.random();

      const newCandle = {
        time: nextTime,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        _internal_originalTime: nextTime,
      };

      lastCandleRef.current = newCandle;
      candleSeriesRef.current.update(newCandle);
    }, 1000);

    // Cleanup
    return () => {
      socket.off("receive_data_forex");
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "300px" }} />
  );
};

export default LiveCandlestickChart;
