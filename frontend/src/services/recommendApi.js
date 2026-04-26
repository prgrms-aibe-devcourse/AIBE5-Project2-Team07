const BASE_URL = 'http://localhost:8080';

/**
 * 조건 선택 기반 추천 공고를 요청합니다.
 * @param {{
 *   regionId: number|null,
 *   workPeriod: string[],
 *   workDays: string[],
 *   workTime: string[],
 *   businessType: string[],
 *   salaryType: string|null,
 *   urgent: boolean,
 *   resultCount: number,
 * }} payload
 * @returns {Promise<Array>}
 */
export async function fetchRecommendJobs(payload) {
  const response = await fetch(`${BASE_URL}/recommend/category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMsg = '맞춤형 추천 공고를 불러오는 중 오류가 발생했습니다.';
    try {
      const err = await response.json();
      errorMsg = err?.message || errorMsg;
    } catch {
      // 응답 본문 파싱 실패 시 기본 메시지를 사용합니다.
    }
    throw new Error(errorMsg);
  }

  return response.json();
}
