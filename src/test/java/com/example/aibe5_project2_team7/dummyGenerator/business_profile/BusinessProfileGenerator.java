package com.example.aibe5_project2_team7.dummyGenerator.business_profile;

import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Random;

public class BusinessProfileGenerator {

	private static final long START_ID = 9010L;
	private static final long END_ID = 9439L;
	private static final String INSERT_BUSINESS_PROFILE_SQL = """
			INSERT IGNORE INTO business_profile
			(id, member_id, company_name, founded_date, company_image_url, brand_id, business_number, company_phone, company_address, homepage_url)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			""";

	public List<BusinessProfileRow> generateBusinessProfiles() {
		Random random = new Random(20260427L);
		List<BusinessProfileRow> rows = new ArrayList<>((int) (END_ID - START_ID + 1));

		for (long id = START_ID; id <= END_ID; id++) {
			LocalDate foundedDate = randomFoundedDate(random);
			Long brandId = extractMiddleTwoDigits(id);
			String businessNumber = randomBusinessNumber(random, id);
			String companyPhone = buildCompanyPhone(random, id);

			rows.add(new BusinessProfileRow(
					id,
					id,
					null,
					foundedDate,
					null,
					brandId,
					businessNumber,
					companyPhone,
					null,
					null
			));
		}

		return rows;
	}

	public int insertGeneratedBusinessProfiles(JdbcTemplate jdbcTemplate) {
		Objects.requireNonNull(jdbcTemplate, "jdbcTemplate must not be null");
		List<BusinessProfileRow> rows = generateBusinessProfiles();

		int[][] results = jdbcTemplate.batchUpdate(
				INSERT_BUSINESS_PROFILE_SQL,
				rows,
				100,
				(ps, row) -> {
					ps.setLong(1, row.id());
					ps.setLong(2, row.memberId());
					ps.setString(3, row.companyName());
					ps.setDate(4, Date.valueOf(row.foundedDate()));
					ps.setString(5, row.companyImageUrl());
					ps.setLong(6, row.brandId());
					ps.setString(7, row.businessNumber());
					ps.setString(8, row.companyPhone());
					ps.setString(9, row.companyAddress());
					ps.setString(10, row.homepageUrl());
				}
		);

		return Arrays.stream(results)
				.flatMapToInt(Arrays::stream)
				.sum();
	}

	private LocalDate randomFoundedDate(Random random) {
		int year = 2020 + random.nextInt(6); // 2020~2025
		int dayOfYear = 1 + random.nextInt(LocalDate.of(year, 1, 1).lengthOfYear());
		return LocalDate.ofYearDay(year, dayOfYear);
	}

	private Long extractMiddleTwoDigits(long id) {
		return (id / 10) % 100;
	}

	private String randomBusinessNumber(Random random, long id) {
		int first = random.nextInt(900) + 100;
		int second = random.nextInt(90) + 10;
		int last = (random.nextInt(9) + 1) * 10000 + (int) (id % 10000);
		return String.format("%03d-%02d-%05d", first, second, last);
	}

	private String buildCompanyPhone(Random random, long id) {
		int middle = random.nextInt(9000) + 1000;
		int last = (int) (id % 10000);
		return String.format("02-%04d-%04d", middle, last);
	}

	public record BusinessProfileRow(
			Long id,
			Long memberId,
			String companyName,
			LocalDate foundedDate,
			String companyImageUrl,
			Long brandId,
			String businessNumber,
			String companyPhone,
			String companyAddress,
			String homepageUrl
	) {
	}
}
