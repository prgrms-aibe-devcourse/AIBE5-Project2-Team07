// src/hooks/useKakaoMap.js
import { useEffect, useRef } from 'react';

export default function useKakaoMap({ lat = 37.5665, lng = 126.9780, level = 3, address = null } = {}) {
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

        // 주소가 있고 정확한 좌표가 없으면 지오코딩 시도
        if (address && (!lat || lat === 37.5665)) {
          geocodeAddress(address);
        } else if (lat && lng && (lat !== 37.5665 || lng !== 126.9780)) {
          // 정확한 좌표가 있으면 마커 표시
          addMarker(lat, lng, address || '근무지');
        }
      });
    };

    const geocodeAddress = (addressStr) => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(addressStr, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          mapInstanceRef.current.setCenter(coords);
          addMarker(result[0].y, result[0].x, addressStr);
        } else {
          // 지오코딩 실패 시 기본 좌표 마커
          addMarker(lat, lng, addressStr || '근무지');
        }
      });
    };

    const addMarker = (markerLat, markerLng, markerTitle) => {
      const markerPosition = new window.kakao.maps.LatLng(markerLat, markerLng);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        title: markerTitle || '근무지'
      });
      marker.setMap(mapInstanceRef.current);

      // 마커 클릭 시 정보 윈도우 표시 (선택)
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;font-weight:bold;">${markerTitle || '근무지'}</div>`
      });
      window.kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(mapInstanceRef.current, marker);
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
  }, [lat, lng, level, address]);

  return { mapRef, mapInstance: mapInstanceRef };
}