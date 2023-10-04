import "./styles.css";
import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import CircularProgress from "@mui/material/CircularProgress";

export default function App() {
  // const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [noMoreData, setNoMoreData] = useState(false);

  const coinsDataRef = useRef([]);
  const pageRef = useRef(1);
  // const loadingRef = useRef(true);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${pageRef.current}&sparkline=false`
          // `https://dummyjson.com/products?limit=10/${pageRef.current}`
        );
        if (res.ok) {
          const data = await res.json();
          // setCoinsData((prev) => [...prev, ...data]);
          if (data.length === 0) {
            // 데이터가 더 이상 없을 경우 noMoreData 상태를 true로 설정합니다.
            setNoMoreData(true);
          }
          coinsDataRef.current = [...coinsDataRef.current, ...data];
          setLoading(false);
          // loadingRef.current = false;
          console.log("여기", data);
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    }, 3000);

    return () => setTimeout(timeout);
  });

  const handleScroll = () => {
    if (noMoreData) {
      return;
    }
    console.log("Height:", document.documentElement.scrollHeight);
    console.log("Top:", document.documentElement.scrollTop);
    console.log("Window:", window.innerHeight);

    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setLoading(true);
      // loadingRef.current = true;
      // setPage((prev) => prev + 1);
      pageRef.current = pageRef.current + 1;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="App">
      <h1 style={{ textAlign: "center" }}>Coin Gallery</h1>

      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateRows: "1fr ",
          gridTemplateColumns: "1fr 1fr 1fr 1fr"
        }}
      >
        {coinsDataRef.current &&
          coinsDataRef.current.map((coin, index) => {
            return (
              <div
                key={index}
                style={{
                  margin: "20px",
                  border: "1px solid black",
                  height: "200px",
                  textAlign: "center",
                  borderRadius: "10px"
                }}
              >
                <img
                  src={coin.image}
                  alt={coin.name}
                  style={{
                    margin: "10px",
                    // backgroundColor: "red",
                    height: "90px",
                    textAlign: "center"
                  }}
                />
                <br />
                {coin.name}
                <br />
                {coin.current_price}
              </div>
            );
          })}
      </div>
      {loading && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      )}
      {noMoreData && (
        <div
          style={{
            gridColumn: "span 4",
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold"
          }}
        >
          No more data
        </div>
      )}
    </div>
  );
}

//에니메이션 관련된 것 -> 시각적으로 정리해보기
