import { useState, useCallback } from 'react';
import { fetchNearbyJobs } from '../services/nearbyApi';

/**
 * 사용자의 현재 위치를 가져온 뒤 주변 공고를 요청하는 커스텀 훅.
 *
 * @returns {{
 *   jobs: Array,
 *   loading: boolean,
 *   error: string|null,
 *   fetchJobs: (radiusKm: number) => void
 * }}
 */
export function useNearbyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** 반경(km)을 받아 위치 획득 → API 호출 */
  const fetchJobs = useCallback((radiusKm) => {
    setLoading(true);
    setError(null);
    setJobs([]);

    if (!navigator.geolocation) {
      setError('이 브라우저는 위치 정보를 지원하지 않습니다.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const data = await fetchNearbyJobs({ latitude, longitude, radiusKm });
          setJobs(Array.isArray(data) ? data : []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        let msg = '위치 정보를 가져올 수 없습니다.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          msg = '위치 정보 접근이 거부되었습니다. 브라우저 설정에서 허용해 주세요.';
        }
        setError(msg);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { jobs, loading, error, fetchJobs };
}
