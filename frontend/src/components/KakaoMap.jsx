import useKakaoMap from '../hooks/useKakaoMap';

export default function KakaoMap({ lat, lng, level }) {
  const { mapRef } = useKakaoMap({ lat, lng, level });

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '400px' }}
    />
  );
}