export const WORK_PERIOD_OPTIONS = [
  { value: 'OneDay', label: '하루' },
  { value: 'OneWeek', label: '1주일 이하' },
  { value: 'OneMonth', label: '1개월 이하' },
  { value: 'ThreeMonths', label: '3개월 이하' },
  { value: 'SixMonths', label: '6개월 이하' },
  { value: 'OneYear', label: '1년 이하' },
  { value: 'MoreThanOneYear', label: '1년 이상' },
];

export const WORK_DAY_OPTIONS = [
  { value: 'MON', label: '월' },
  { value: 'TUE', label: '화' },
  { value: 'WED', label: '수' },
  { value: 'THU', label: '목' },
  { value: 'FRI', label: '금' },
  { value: 'SAT', label: '토' },
  { value: 'SUN', label: '일' },
];

export const WORK_TIME_OPTIONS = [
  { value: 'MORNING', label: '오전' },
  { value: 'AFTERNOON', label: '오후' },
  { value: 'EVENING', label: '저녁' },
  { value: 'NIGHT', label: '새벽' },
  { value: 'MORNING_AFTERNOON', label: '오전~오후' },
  { value: 'AFTERNOON_EVENING', label: '오후~저녁' },
  { value: 'EVENING_NIGHT', label: '저녁~새벽' },
  { value: 'NIGHT_MORNING', label: '새벽~오전' },
  { value: 'FULLTIME', label: '풀타임(8시간 이상)' },
];

export const BUSINESS_TYPE_OPTIONS = [
  { value: 'FOOD_RESTAURANT', label: '외식·음식점' },
  { value: 'CAFE', label: '카페' },
  { value: 'RETAIL_STORE', label: '매장관리·판매' },
  { value: 'SERVICE', label: '서비스' },
  { value: 'DELIVERY_DRIVER', label: '운전·배달' },
  { value: 'MANUAL_LABOR', label: '현장 단순 노무' },
];

export const SALARY_TYPE_OPTIONS = [
  { value: 'HOURLY', label: '시급' },
  { value: 'MONTHLY', label: '월급' },
];

export const RECOMMEND_RESULT_COUNT_MIN = 1;
export const RECOMMEND_RESULT_COUNT_MAX = 30;

export const RECOMMEND_DEFAULT_FILTERS = {
  regionId: null,
  workPeriod: [],
  workDays: [],
  workTime: [],
  businessType: [],
  salaryType: null,
  urgent: false,
  resultCount: 20,
};

export const OPTION_LABEL_MAP = {
  workPeriod: Object.fromEntries(WORK_PERIOD_OPTIONS.map((option) => [option.value, option.label])),
  workDays: Object.fromEntries(WORK_DAY_OPTIONS.map((option) => [option.value, option.label])),
  workTime: Object.fromEntries(WORK_TIME_OPTIONS.map((option) => [option.value, option.label])),
  businessType: Object.fromEntries(BUSINESS_TYPE_OPTIONS.map((option) => [option.value, option.label])),
  salaryType: Object.fromEntries(SALARY_TYPE_OPTIONS.map((option) => [option.value, option.label])),
};
