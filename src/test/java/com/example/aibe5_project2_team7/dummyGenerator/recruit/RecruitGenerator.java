package com.example.aibe5_project2_team7.dummyGenerator.recruit;

import com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName;
import com.example.aibe5_project2_team7.recruit.constant.Days;
import com.example.aibe5_project2_team7.recruit.constant.Period;
import com.example.aibe5_project2_team7.recruit.constant.RecruitStatus;
import com.example.aibe5_project2_team7.recruit.constant.SalaryType;
import com.example.aibe5_project2_team7.recruit.constant.Times;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.stream.Collectors;

public class RecruitGenerator {

	private static final long START_ID = 9000L;
	// 하위 테이블도 모두 9000번대 이상 id를 사용한다.
	private static final long START_CHILD_ID = 9000L;
	// 공고 생성 개수 설정 (1290 이상 권장)
	private static final int FIXED_RECRUIT_COUNT = 1290;
	private static final long DEFAULT_REGION_ID = 1L;
	private static final long MIN_BRAND_ID = 1L;
	private static final long MAX_BRAND_ID = 43L;
	private static final LocalDate URGENT_DEADLINE_CUTOFF = LocalDate.of(2026, 5, 1);
	private static final LocalDate SHORT_DEADLINE_START = LocalDate.of(2026, 4, 28);
	private static final LocalDate SHORT_DEADLINE_END = LocalDate.of(2026, 5, 5);
	private static final LocalDate LONG_DEADLINE_START = LocalDate.of(2026, 5, 1);
	private static final LocalDate LONG_DEADLINE_END = LocalDate.of(2026, 5, 31);
	private static final LocalDateTime CREATED_AT_START = LocalDateTime.of(2026, 4, 25, 0, 0, 0);
	private static final LocalDateTime CREATED_AT_END = LocalDateTime.of(2026, 4, 28, 12, 0, 0);

	private static final String INSERT_RECRUIT_SQL = """
			INSERT IGNORE INTO recruit
			(id, business_member_id, title, brand_id, is_urgent, recruit_status, deadline, salary, salary_type, head_count, region_id, detail_address, description, resume_form_url, latitude, longitude, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			""";
	private static final String INSERT_BUSINESS_TYPE_SQL = """
			INSERT IGNORE INTO business_type
			(id, recruit_id, type)
			VALUES (?, ?, ?)
			""";
	private static final String INSERT_WORK_DAYS_SQL = """
			INSERT IGNORE INTO work_days
			(id, recruit_id, day)
			VALUES (?, ?, ?)
			""";
	private static final String INSERT_WORK_PERIOD_SQL = """
			INSERT IGNORE INTO work_period
			(id, recruit_id, period)
			VALUES (?, ?, ?)
			""";
	private static final String INSERT_WORK_TIME_SQL = """
			INSERT IGNORE INTO work_time
			(id, recruit_id, times)
			VALUES (?, ?, ?)
			""";
			private static final String SELECT_BUSINESS_PROFILE_ADDRESS_SQL = """
					SELECT id, company_address
					FROM business_profile
					""";
			private static final String SELECT_REGION_ID_SQL = """
					SELECT id
					FROM region
					WHERE sido = ? AND sigungu = ?
					""";
	private static final String SELECT_BUSINESS_TYPE_SQL = """
					SELECT business_type
					FROM brand
					WHERE id = ?
					""";
	private static final String SELECT_BRAND_NAME_SQL = """
					SELECT name
					FROM brand
					WHERE id = ?
					""";
	private static final String SELECT_COMPANY_NAME_SQL = """
					SELECT company_name
					FROM business_profile
					WHERE id = ?
					""";

	private static final String[] TITLE_PREFIXES = {
			"Store Staff", "Cafe Crew", "Kitchen Assistant", "Delivery Partner", "Service Staff"
	};

	public List<RecruitRow> generateRecruits() {
		return generateRecruitBundles()
				.stream()
				.map(RecruitBundle::recruit)
				.collect(Collectors.toList());
	}

	/**
	 * 공고 1건을 생성할 때, 하위 4개 테이블 데이터도 함께 묶어서 생성한다.
	 * (recruit + business_type + work_days + work_period + work_time)
	 */
	public List<RecruitBundle> generateRecruitBundles() {
		return generateRecruitBundles(null);
	}

	public List<RecruitBundle> generateRecruitBundles(JdbcTemplate jdbcTemplate) {
		Random random = new Random(20260428L);
		List<RecruitBundle> bundles = new ArrayList<>(FIXED_RECRUIT_COUNT);
		long workDayIdCounter = START_CHILD_ID; // WorkDayRow용 전역 카운터

		for (int i = 0; i < FIXED_RECRUIT_COUNT; i++) {
			long id = START_ID + i;
			long childId = START_CHILD_ID + i;
			// brand_id 규칙: 50%는 (i/30+1), 50%는 1~43 랜덤
			long sequenceBrandId = (i / 30L) + 1L;
			long randomBrandId = randomBetween(random, MIN_BRAND_ID, MAX_BRAND_ID);
			Long brandId = random.nextBoolean() ? sequenceBrandId : randomBrandId;
			// business_member_id 규칙: 9XXX, 가운데 두 자리는 brand_id, 마지막 한 자리는 랜덤
			long businessMemberId = 9000L + (brandId * 10L) + random.nextInt(10);
			// 요구사항: 공고 상태는 항상 OPEN
			RecruitStatus status = RecruitStatus.OPEN;
			// 요구사항: isShort에 따라 deadline 범위를 다르게 생성
			boolean isShort = random.nextBoolean();
			LocalDate deadline = randomDeadlineByType(random, isShort);
			// isShort=true면 salary_type은 HOURLY 고정.
			// 그 외(미확정 케이스)는 50% HOURLY / 50% MONTHLY로 확정.
			SalaryType salaryType = isShort ? SalaryType.HOURLY : randomSalaryType(random);
			// isShort=true 이면서 deadline<=2026-05-01 인 경우에만 50%로 true, 그 외는 false
			boolean urgent = randomUrgent(random, isShort, deadline);// 요구사항: head_count는 1~10 자연수 또는 null
			Integer headCount = random.nextInt(5) == 0 ? null : (random.nextInt(10) + 1);
			// region/detail은 DB 조회 기반으로 insert 직전에 확정한다.
			String detailAddress = "";
			// 요구사항: resume_form_url, latitude, longitude는 항상 null로 고정
			String resumeFormUrl = null;
			Double latitude = null;
			Double longitude = null;
			// brand_id로 business_type 조회, jdbcTemplate이 없으면 랜덤 생성으로 fallback
			BusinessTypeName businessType = (jdbcTemplate != null) 
					? findBusinessTypeByBrandId(jdbcTemplate, brandId)
					: randomBusinessType(random);
			if (businessType == null) {
				businessType = randomBusinessType(random); // 조회 실패 시 fallback
			}
			
			// work_days 생성 로직
			List<Days> workDaysList;
			if (isShort) {
				// 단기 공고: deadline에 부합하는 요일 하나만 선택
				Days deadlineDay = findDayMatchingDeadline(deadline);
				workDaysList = List.of(deadlineDay);
			} else {
				// 장기 공고: 2~5개의 요일을 랜덤으로 선택
				int dayCount = 2 + random.nextInt(4); // 2, 3, 4, 5 중 하나
				workDaysList = randomMultipleDays(random, dayCount);
			}
			
			// 최종 work_days 리스트 크기 확인
			if (workDaysList == null || workDaysList.isEmpty()) {
				// fallback: 최소 하나의 요일을 보장
				workDaysList = List.of(Days.MON);
			} else if (workDaysList.size() > 5) {
				// 최대 5개로 제한
				workDaysList = workDaysList.subList(0, 5);
			}
			
			// salary 계산 - Monthly인 경우 요일 개수에 따라 조정
			int baseSalary = randomSalary(random, salaryType, urgent);
			if (salaryType == SalaryType.MONTHLY) {
				double multiplier = (double) workDaysList.size() / 5.0;
				baseSalary = (int) Math.round(baseSalary * multiplier);
			}
			int salary = baseSalary;
			
			// isShort=true면 OneDay 고정.
			// salary_type=MONTHLY이면 장기 기간(3개월/6개월/1년/1년 이상) 중 하나로 제한.
			Period workPeriod = isShort
					? Period.OneDay
					: (salaryType == SalaryType.MONTHLY ? randomMonthlyPeriod(random) : randomFullPeriod(random));
			Times workTime = randomTime(random);
			// created_at은 지정된 기간 내 랜덤, updated_at은 created_at과 동일하게 고정
			LocalDateTime createdAt = randomCreatedAtBetween(random);

			// title과 description 생성 (모든 정보 결정 후)
			String title = generateTitle(jdbcTemplate, brandId, businessMemberId, workDaysList, workTime, id, random, urgent);
			String description = title; // description은 title과 동일하게 설정

			RecruitRow recruitRow = new RecruitRow(
					id,
					businessMemberId,
					title,
					brandId,
					urgent,
					status,
					deadline,
					salary,
					salaryType,
					headCount,
					DEFAULT_REGION_ID,
					detailAddress,
					description,
					resumeFormUrl,
					latitude,
					longitude,
					createdAt,
					createdAt
			);

			// 여러 WorkDayRow 생성
			List<WorkDayRow> workDayRows = new ArrayList<>();
			for (int dayIndex = 0; dayIndex < workDaysList.size(); dayIndex++) {
				long workDayId = workDayIdCounter++; // 전역 카운터 사용
				Days day = workDaysList.get(dayIndex);
				WorkDayRow workDayRow = new WorkDayRow(workDayId, id, day);
				workDayRows.add(workDayRow);
			}

			bundles.add(new RecruitBundle(
					recruitRow,
					new BusinessTypeRow(childId, id, businessType),
					workDayRows,
					new WorkPeriodRow(workDayIdCounter++, id, workPeriod),
					new WorkTimeRow(workDayIdCounter++, id, workTime)
			));
		}

		return bundles;
	}

	/**
	 * 고정 개수(1290)의 공고를 생성하고, 공고당 5개 테이블 데이터를 모두 삽입한다.
	 * FK 제약 때문에 recruit를 먼저 넣고, 하위 테이블을 순서대로 넣는다.
	 */
	public int insertGeneratedRecruits(JdbcTemplate jdbcTemplate) {
		Objects.requireNonNull(jdbcTemplate, "jdbcTemplate must not be null");
		List<RecruitBundle> bundles = generateRecruitBundles(jdbcTemplate);
		Map<Long, String> companyAddressByBusinessProfileId = loadCompanyAddressMap(jdbcTemplate);

		List<RecruitRow> recruitRows = bundles.stream()
				.map(RecruitBundle::recruit)
				.map(row -> {
					AddressResolution resolution = resolveRegionAndDetailAddress(
							jdbcTemplate,
							companyAddressByBusinessProfileId.get(row.businessMemberId())
					);
					return new RecruitRow(
							row.id(),
							row.businessMemberId(),
							row.title(),
							row.brandId(),
							row.urgent(),
							row.status(),
							row.deadline(),
							row.salary(),
							row.salaryType(),
							row.headCount(),
							resolution.regionId(),
							resolution.detailAddress(),
							row.description(),
							row.resumeFormUrl(),
							row.latitude(),
							row.longitude(),
							row.createdAt(),
							row.updatedAt()
					);
				})
				.collect(Collectors.toList());
		List<BusinessTypeRow> businessTypeRows = bundles.stream().map(RecruitBundle::businessType).collect(Collectors.toList());
		List<WorkDayRow> workDayRows = bundles.stream()
				.flatMap(bundle -> bundle.workDays().stream())
				.collect(Collectors.toList());
		List<WorkPeriodRow> workPeriodRows = bundles.stream().map(RecruitBundle::workPeriod).collect(Collectors.toList());
		List<WorkTimeRow> workTimeRows = bundles.stream().map(RecruitBundle::workTime).collect(Collectors.toList());

		int insertedRecruit = sumBatchResults(jdbcTemplate.batchUpdate(
				INSERT_RECRUIT_SQL,
				recruitRows,
				100,
				(ps, row) -> {
					// SQL 컬럼 순서와 동일한 인덱스로 바인딩
					ps.setLong(1, row.id());
					ps.setLong(2, row.businessMemberId());
					ps.setString(3, row.title());
					ps.setObject(4, row.brandId());
					ps.setBoolean(5, row.urgent());
					ps.setString(6, row.status().name());
					ps.setDate(7, Date.valueOf(row.deadline()));
					ps.setInt(8, row.salary());
					ps.setString(9, row.salaryType().name());
					ps.setObject(10, row.headCount());
					ps.setLong(11, row.regionId());
					ps.setString(12, row.detailAddress());
					ps.setString(13, row.description());
					ps.setString(14, row.resumeFormUrl());
					ps.setObject(15, row.latitude());
					ps.setObject(16, row.longitude());
					ps.setTimestamp(17, Timestamp.valueOf(row.createdAt()));
					ps.setTimestamp(18, Timestamp.valueOf(row.updatedAt()));
				}
		));

		int insertedBusinessType = sumBatchResults(jdbcTemplate.batchUpdate(
				INSERT_BUSINESS_TYPE_SQL,
				businessTypeRows,
				100,
				(ps, row) -> {
					ps.setLong(1, row.id());
					ps.setLong(2, row.recruitId());
					ps.setString(3, row.type().name());
				}
		));

		int insertedWorkDays = sumBatchResults(jdbcTemplate.batchUpdate(
				INSERT_WORK_DAYS_SQL,
				workDayRows,
				100,
				(ps, row) -> {
					ps.setLong(1, row.id());
					ps.setLong(2, row.recruitId());
					ps.setString(3, row.day().name());
				}
		));

		int insertedWorkPeriod = sumBatchResults(jdbcTemplate.batchUpdate(
				INSERT_WORK_PERIOD_SQL,
				workPeriodRows,
				100,
				(ps, row) -> {
					ps.setLong(1, row.id());
					ps.setLong(2, row.recruitId());
					ps.setString(3, row.period().name());
				}
		));

		int insertedWorkTime = sumBatchResults(jdbcTemplate.batchUpdate(
				INSERT_WORK_TIME_SQL,
				workTimeRows,
				100,
				(ps, row) -> {
					ps.setLong(1, row.id());
					ps.setLong(2, row.recruitId());
					ps.setString(3, row.times().name());
				}
		));

		return insertedRecruit + insertedBusinessType + insertedWorkDays + insertedWorkPeriod + insertedWorkTime;
	}

	private int sumBatchResults(int[][] results) {
		return Arrays.stream(results)
				.flatMapToInt(Arrays::stream)
				.sum();
	}

	private long randomBetween(Random random, long min, long max) {
		return min + random.nextInt((int) (max - min + 1));
	}

	private String randomTitle(Random random, int index) {
		String prefix = TITLE_PREFIXES[random.nextInt(TITLE_PREFIXES.length)];
		return prefix + " Hiring " + index;
	}

	private LocalDate randomDeadlineByType(Random random, boolean isShort) {
		if (isShort) {
			return randomDateInRange(random, SHORT_DEADLINE_START, SHORT_DEADLINE_END);
		}
		return randomDateInRange(random, LONG_DEADLINE_START, LONG_DEADLINE_END);
	}

	private LocalDate randomDateInRange(Random random, LocalDate start, LocalDate end) {
		int days = (int) (end.toEpochDay() - start.toEpochDay());
		return start.plusDays(random.nextInt(days + 1));
	}

	private SalaryType randomSalaryType(Random random) {
		return random.nextBoolean() ? SalaryType.HOURLY : SalaryType.MONTHLY;
	}

	private boolean randomUrgent(Random random, boolean isShort, LocalDate deadline) {
		if (isShort && !deadline.isAfter(URGENT_DEADLINE_CUTOFF)) {
			return random.nextBoolean();
		}
		return false;
	}

	private BusinessTypeName randomBusinessType(Random random) {
		BusinessTypeName[] values = BusinessTypeName.values();
		return values[random.nextInt(values.length)];
	}

	private Days randomDay(Random random) {
		Days[] values = Days.values();
		return values[random.nextInt(values.length)];
	}

	private Period randomPeriod(Random random) {
		Period[] values = Period.values();
		return values[random.nextInt(values.length)];
	}

	private Period randomFullPeriod(Random random) {
		Period[] fullPeriods = {
				Period.OneWeek,
				Period.OneMonth,
				Period.ThreeMonths,
				Period.SixMonths,
				Period.OneYear,
				Period.MoreThanOneYear
		};
		return fullPeriods[random.nextInt(fullPeriods.length)];
	}

	private Period randomMonthlyPeriod(Random random) {
		Period[] monthlyPeriods = {
				Period.ThreeMonths,
				Period.SixMonths,
				Period.OneYear,
				Period.MoreThanOneYear
		};
		return monthlyPeriods[random.nextInt(monthlyPeriods.length)];
	}

	private Times randomTime(Random random) {
		Times[] values = Times.values();
		return values[random.nextInt(values.length)];
	}

	private Days findDayMatchingDeadline(LocalDate deadline) {
		// LocalDate의 요일을 java.time.DayOfWeek로 변환 후 Days enum으로 매핑
		java.time.DayOfWeek dayOfWeek = deadline.getDayOfWeek();
		return switch (dayOfWeek) {
			case MONDAY -> Days.MON;
			case TUESDAY -> Days.TUE;
			case WEDNESDAY -> Days.WED;
			case THURSDAY -> Days.THU;
			case FRIDAY -> Days.FRI;
			case SATURDAY -> Days.SAT;
			case SUNDAY -> Days.SUN;
		};
	}

	private List<Days> randomMultipleDays(Random random, int count) {
		if (count <= 0) {
			return List.of(Days.MON); // fallback
		}
		
		Days[] allDays = Days.values();
		List<Days> selectedDays = new ArrayList<>();
		List<Days> availableDays = new ArrayList<>(Arrays.asList(allDays));
		
		for (int i = 0; i < count && !availableDays.isEmpty(); i++) {
			int index = random.nextInt(availableDays.size());
			Days selectedDay = availableDays.remove(index);
			selectedDays.add(selectedDay);
		}
		
		return selectedDays;
	}

	private int randomSalary(Random random, SalaryType salaryType, boolean urgent) {
		if (salaryType == SalaryType.HOURLY) {
			// HOURLY 기본 범위는 유지하되, 하한(10,320) 근처 값이 더 자주 나오도록 편향 분포를 적용
			double biased = Math.pow(random.nextDouble(), 2.0);
			int baseHourly = 10_320 + (int) Math.floor(biased * 4_681);
			if (urgent) {
				// 긴급 공고는 1.2배 후 일의 자리(10원 단위)에서 반올림
				return roundToNearestTen(baseHourly * 1.2);
			}
			return baseHourly;
		}

		// MONTHLY 범위: 220만 ~ 250만, 만 단위(천의 자리 이하 0) 고정
		int monthlyInMan = 220 + random.nextInt(31); // 220~250
		return monthlyInMan * 10_000;
	}

	private int roundToNearestTen(double value) {
		return (int) (Math.round(value / 10.0) * 10);
	}

	private Map<Long, String> loadCompanyAddressMap(JdbcTemplate jdbcTemplate) {
		Map<Long, String> result = new HashMap<>();
		jdbcTemplate.query(SELECT_BUSINESS_PROFILE_ADDRESS_SQL, rs -> {
			result.put(rs.getLong("id"), rs.getString("company_address"));
		});
		return result;
	}

	/**
	 * 주소 파싱 규칙:
	 * 1) [시/도=1어절, 시/군/구=2어절]로 region 조회
	 * 2) 실패 시 [시/군/구=2어절 + 공백 + 3어절]로 재조회
	 * 3) 성공 시 사용 어절 제외 나머지를 detail_address로 사용
	 * 4) 최종 실패 시 region_id=1, detail_address=''
	 */
	private AddressResolution resolveRegionAndDetailAddress(JdbcTemplate jdbcTemplate, String companyAddress) {
		if (companyAddress == null || companyAddress.isBlank()) {
			return new AddressResolution(DEFAULT_REGION_ID, "");
		}

		String[] words = companyAddress.trim().split("\\s+");
		if (words.length < 2) {
			return new AddressResolution(DEFAULT_REGION_ID, "");
		}

		String sido = words[0];
		Long regionId = findRegionId(jdbcTemplate, sido, words[1]);
		int consumedWords = 2;

		if (regionId == null && words.length >= 3) {
			String mergedSigungu = words[1] + " " + words[2];
			regionId = findRegionId(jdbcTemplate, sido, mergedSigungu);
			consumedWords = 3;
		}

		if (regionId == null) {
			return new AddressResolution(DEFAULT_REGION_ID, "");
		}

		String detailAddress = words.length > consumedWords
				? String.join(" ", Arrays.copyOfRange(words, consumedWords, words.length))
				: "";

		return new AddressResolution(regionId, detailAddress);
	}

	private Long findRegionId(JdbcTemplate jdbcTemplate, String sido, String sigungu) {
		List<Long> ids = jdbcTemplate.query(
				SELECT_REGION_ID_SQL,
				(ps) -> {
					ps.setString(1, sido);
					ps.setString(2, sigungu);
				},
				(rs, rowNum) -> rs.getLong("id")
		);
		return ids.isEmpty() ? null : ids.get(0);
	}

	private BusinessTypeName findBusinessTypeByBrandId(JdbcTemplate jdbcTemplate, Long brandId) {
		List<BusinessTypeName> types = jdbcTemplate.query(
				SELECT_BUSINESS_TYPE_SQL,
				(ps) -> ps.setLong(1, brandId),
				(rs, rowNum) -> BusinessTypeName.valueOf(rs.getString("business_type"))
		);
		return types.isEmpty() ? null : types.get(0);
	}

	private String findBrandNameById(JdbcTemplate jdbcTemplate, Long brandId) {
		List<String> names = jdbcTemplate.query(
				SELECT_BRAND_NAME_SQL,
				(ps) -> ps.setLong(1, brandId),
				(rs, rowNum) -> rs.getString("name")
		);
		return names.isEmpty() ? null : names.get(0);
	}

	private String findCompanyNameById(JdbcTemplate jdbcTemplate, Long businessMemberId) {
		List<String> names = jdbcTemplate.query(
				SELECT_COMPANY_NAME_SQL,
				(ps) -> ps.setLong(1, businessMemberId),
				(rs, rowNum) -> rs.getString("company_name")
		);
		return names.isEmpty() ? null : names.get(0);
	}

	private String generateTitle(JdbcTemplate jdbcTemplate, Long brandId, Long businessMemberId, 
			List<Days> workDaysList, Times workTime, long recruitId, Random random, boolean urgent) {
		// [회사정보] - 40% 브랜드명, 40% 회사명, 20% 생략
		String companyInfo = "";
		if (jdbcTemplate != null) {
			double rand = random.nextDouble();
			
			if (rand < 0.4) {
				// 40% 브랜드명
				String brandName = findBrandNameById(jdbcTemplate, brandId);
				companyInfo = (brandName != null) ? brandName : "a";
			} else if (rand < 0.8) {
				// 40% 회사명
				String companyName = findCompanyNameById(jdbcTemplate, businessMemberId);
				companyInfo = (companyName != null) ? companyName : "b";
			} else {
				// 20% 생략
				companyInfo = "";
			}
		} else {
			companyInfo = ""; // jdbcTemplate이 없으면 생략
		}
		
		// [근무요일] - 요일 목록을 문자열로 변환
		String workDaysStr;
		if (workDaysList.size() == 1) {
			// 요일이 하나일 때 '요일' 명시
			Days day = workDaysList.get(0);
			workDaysStr = switch (day) {
				case MON -> "월요일";
				case TUE -> "화요일";
				case WED -> "수요일";
				case THU -> "목요일";
				case FRI -> "금요일";
				case SAT -> "토요일";
				case SUN -> "일요일";
				default -> day.name();
			};
		} else {
			// 여러 요일일 때 월,화,수,목,금,토,일 순서로 정렬
			workDaysStr = workDaysList.stream()
					.sorted((d1, d2) -> {
						// 요일 순서: MON(1) < TUE(2) < WED(3) < THU(4) < FRI(5) < SAT(6) < SUN(7)
						return Integer.compare(d1.ordinal(), d2.ordinal());
					})
					.map(day -> {
						return switch (day) {
							case MON -> "월";
							case TUE -> "화";
							case WED -> "수";
							case THU -> "목";
							case FRI -> "금";
							case SAT -> "토";
							case SUN -> "일";
							default -> day.name();
						};
					})
					.collect(Collectors.joining(","));
		}
		
		// [근무시간] - 30% 확률로 생략
		String workTimeStr = "";
		if (random.nextDouble() < 0.7) { // 70% 확률로 표시
			workTimeStr = switch (workTime) {
				case MORNING -> "오전";
				case AFTERNOON -> "오후";
				case EVENING -> "저녁";
				case NIGHT -> "새벽";
				case MORNING_AFTERNOON -> "오전~오후";
				case AFTERNOON_EVENING -> "오후~저녁";
				case EVENING_NIGHT -> "저녁~새벽";
				case NIGHT_MORNING -> "새벽~오전";
				case FULLTIME -> "풀타임";
			};
		}
		// 30% 확률로 생략 (빈 문자열)
		
		// [알바] - 동일 확률로 선택
		String[] jobTypes = {"알바", "알바하실분", "일하실분", "아르바이트"};
		String jobType = jobTypes[(int) (recruitId % jobTypes.length)];
		
		// [마무리] - urgent 여부에 따른 마무리 문구
		String ending;
		if (urgent) {
			// 긴급 공고: '급구', '급합니다' 중 하나
			String[] urgentEndings = {"급구", "급합니다"};
			ending = urgentEndings[(int) (recruitId % urgentEndings.length)];
		} else {
			// 일반 공고: '모집', '찾습니다', '구합니다' 중 하나
			String[] normalEndings = {"모집", "찾습니다", "구합니다"};
			ending = normalEndings[(int) (recruitId % normalEndings.length)];
		}
		
		// 최종 title 조합 - 빈 요소가 있을 때 중복 공백 방지
		List<String> titleParts = new ArrayList<>();
		if (!companyInfo.isEmpty()) titleParts.add(companyInfo);
		if (!workDaysStr.isEmpty()) titleParts.add(workDaysStr);
		if (!workTimeStr.isEmpty()) titleParts.add(workTimeStr);
		if (!jobType.isEmpty()) titleParts.add(jobType);
		if (!ending.isEmpty()) titleParts.add(ending);
		
		return String.join(" ", titleParts);
	}

	private LocalDateTime randomCreatedAtBetween(Random random) {
		long startEpoch = Timestamp.valueOf(CREATED_AT_START).getTime();
		long endEpoch = Timestamp.valueOf(CREATED_AT_END).getTime();
		long randomEpoch = startEpoch + (long) (random.nextDouble() * (endEpoch - startEpoch + 1));
		return new Timestamp(randomEpoch).toLocalDateTime();
	}

	public record RecruitRow(
			Long id,
			Long businessMemberId,
			String title,
			Long brandId,
			Boolean urgent,
			RecruitStatus status,
			LocalDate deadline,
			Integer salary,
			SalaryType salaryType,
			Integer headCount,
			Long regionId,
			String detailAddress,
			String description,
			String resumeFormUrl,
			Double latitude,
			Double longitude,
			LocalDateTime createdAt,
			LocalDateTime updatedAt
	) {
	}

	public record BusinessTypeRow(Long id, Long recruitId, BusinessTypeName type) {
	}

	public record WorkDayRow(Long id, Long recruitId, Days day) {
	}

	public record WorkPeriodRow(Long id, Long recruitId, Period period) {
	}

	public record WorkTimeRow(Long id, Long recruitId, Times times) {
	}

	private record AddressResolution(Long regionId, String detailAddress) {
	}

	public record RecruitBundle(
			RecruitRow recruit,
			BusinessTypeRow businessType,
			List<WorkDayRow> workDays,
			WorkPeriodRow workPeriod,
			WorkTimeRow workTime
	) {
	}
}
