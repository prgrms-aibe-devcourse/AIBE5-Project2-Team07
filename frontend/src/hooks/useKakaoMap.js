// src/hooks/useKakaoMap.js
import { useEffect, useRef } from 'react';

export default function useKakaoMap({ lat = 37.5665, lng = 126.9780, level = 3 } = {}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level,
        };
        mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, options);
      });
    };

    // 이미 카카오 스크립트가 로드된 경우
    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    // 아직 로드 안 된 경우 — 스크립트 onload 기다리기
    const script = document.querySelector(
      'script[src*="dapi.kakao.com"]'
    );
    if (script) {
      script.onload = initMap;
    }
  }, [lat, lng, level]);

  return { mapRef, mapInstance: mapInstanceRef };
}