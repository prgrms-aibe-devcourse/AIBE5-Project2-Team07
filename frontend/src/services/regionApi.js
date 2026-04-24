/**
 * 추천 필터용 전체 지역 목록을 불러옵니다.
 * @returns {Promise<Array<{id:number, fullName:string, sido:string, sigungu:string}>>}
 */
export async function fetchRegions() {
  const response = await fetch('/api/regions');

  if (!response.ok) {
    let errorMsg = '지역 목록을 불러오는 중 오류가 발생했습니다.';
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
