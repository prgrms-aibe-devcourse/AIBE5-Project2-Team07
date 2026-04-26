package com.example.aibe5_project2_team7.dummyGenerator.member;

import org.springframework.jdbc.core.JdbcTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Random;

public class BusinessMemberAddressGenerator {

	private static final long START_ID = 9010L;
	private static final long END_ID = 9439L;
	private static final int MIN_REGION_ID = 1;
	private static final int MAX_REGION_ID = 249;
	private static final String INSERT_MEMBER_ADDRESS_SQL = """
			INSERT IGNORE INTO member_address
			(id, member_id, region_id, detail_address)
			VALUES (?, ?, ?, ?)
			""";
	private static final String[] ROAD_NAMES = {
			"Teheran-ro", "Gangnam-daero", "Olympic-ro", "Sejong-daero", "WorldCupbuk-ro",
			"Songpa-daero", "Dongtan-daero", "Jungang-ro", "Bongunsa-ro", "Digital-ro"
	};

	public List<MemberAddressRow> generateMemberAddresses() {
		Random random = new Random(20260426L);
		List<MemberAddressRow> rows = new ArrayList<>((int) (END_ID - START_ID + 1));

		for (long id = START_ID; id <= END_ID; id++) {
			long regionId = randomRegionId(random);
			String detailAddress = randomDetailAddress(random);
			rows.add(new MemberAddressRow(id, id, regionId, detailAddress));
		}

		return rows;
	}

	public int insertGeneratedMemberAddresses(JdbcTemplate jdbcTemplate) {
		Objects.requireNonNull(jdbcTemplate, "jdbcTemplate must not be null");
		List<MemberAddressRow> rows = generateMemberAddresses();

		int[][] results = jdbcTemplate.batchUpdate(
				INSERT_MEMBER_ADDRESS_SQL,
				rows,
				100,
				(ps, row) -> {
					ps.setLong(1, row.id());
					ps.setLong(2, row.memberId());
					ps.setLong(3, row.regionId());
					ps.setString(4, row.detailAddress());
				}
		);

		return Arrays.stream(results)
				.flatMapToInt(Arrays::stream)
				.sum();
	}

	private long randomRegionId(Random random) {
		return MIN_REGION_ID + random.nextInt(MAX_REGION_ID - MIN_REGION_ID + 1);
	}

	private String randomDetailAddress(Random random) {
		String road = ROAD_NAMES[random.nextInt(ROAD_NAMES.length)];
		int mainNo = random.nextInt(300) + 1;
		int subNo = random.nextInt(60) + 1;
		int floor = random.nextInt(20) + 1;
		int unit = random.nextInt(30) + 1;
		return String.format("%s %d-%d, %dF %d", road, mainNo, subNo, floor, unit);
	}

	public record MemberAddressRow(Long id, Long memberId, Long regionId, String detailAddress) {
	}
}
