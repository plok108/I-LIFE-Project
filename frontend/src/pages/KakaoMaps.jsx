import React, { useEffect } from "react";

const KakaoMap = () => {
  useEffect(() => {
    if (window.kakao && window.kakao.maps) return; // 이미 로드된 경우 방지
    console.log("Kakao key:", process.env.REACT_APP_KAKAO_KEY);
    // ✅ 스크립트 동적 로드
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.4486, 126.6576), // 인하공전 중심 좌표
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        // ✅ 줌 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
      });
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "400px", // 부모 높이에 맞춰 고정
        borderRadius: "8px",
        marginTop: "16px",
      }}
    ></div>
  );
};

export default KakaoMap;
