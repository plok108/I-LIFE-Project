import React, { useEffect } from "react";

const KakaoMap = () => {
  useEffect(() => {
    console.log("✅ useEffect 실행됨");
    console.log("Kakao key:", process.env.REACT_APP_KAKAO_KEY);

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_KEY}&autoload=false`;
    script.async = true;

    script.onload = async () => {
      console.log("✅ Kakao SDK 로드 완료");

      if (!window.kakao) {
        console.error("❌ window.kakao 없음");
        return;
      }

      window.kakao.maps.load(async () => {
        console.log("✅ Kakao Maps API 준비 완료");

        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.4486, 126.6576),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);

        // ✅ 네이버 도보 경로 요청 실행
        const getWalkPath = async () => {
          try {
            const res = await fetch(
              "http://localhost:8080/api/naver/walk?startX=126.657497&startY=37.448711&endX=126.658021&endY=37.449190"
            );
            const data = await res.json();
            const path = data.route.traoptimal[0].path;
            console.log("✅ 도보 경로:", path);

            // ✅ Kakao 지도에 선(polyline)으로 표시
            const linePath = path.map(
              ([lng, lat]) => new window.kakao.maps.LatLng(lat, lng)
            );

            const polyline = new window.kakao.maps.Polyline({
              path: linePath,
              strokeWeight: 5,
              strokeColor: "#00AACC",
              strokeOpacity: 0.9,
              strokeStyle: "solid",
            });
            polyline.setMap(map);
          } catch (err) {
            console.error("❌ 도보 경로 요청 실패:", err);
          }
        };

        await getWalkPath(); // ✅ 함수 실제 실행
      });
    };

    script.onerror = (err) => console.error("❌ Kakao SDK 로드 실패:", err);
    document.head.appendChild(script);
  }, []);

  return (
    <div
      id="map"
      style={{ width: "100%", height: "400px", borderRadius: "8px" }}
    ></div>
  );
};

export default KakaoMap;
