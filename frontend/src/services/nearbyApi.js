const BASE_URL = 'http://localhost:8080';

/**
 * 사용자 위치 기반 주변 공고 추천을 요청합니다.
 * @param {number} latitude  - 사용자 위도
 * @param {number} longitude - 사용자 경도
 * @param {number} radiusKm  - 검색 반경 (km)
 * @returns {Promise<Array>} RecruitNearbyResponseDto 배열
 */
export async function fetchNearbyJobs({ latitude, longitude, radiusKm }) {
  const response = await fetch(`${BASE_URL}/recommend/nearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ latitude, longitude, radiusKm }),
  });

  if (!response.ok) {
    let errorMsg = '주변 공고를 불러오는 중 오류가 발생했습니다.';
    try {
      const err = await response.json();
      errorMsg = err?.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return response.json();
}
