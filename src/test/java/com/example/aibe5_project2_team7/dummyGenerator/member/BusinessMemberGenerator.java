package com.example.aibe5_project2_team7.dummyGenerator.member;

import com.example.aibe5_project2_team7.member.Gender;
import com.example.aibe5_project2_team7.member.Member;
import com.example.aibe5_project2_team7.member.MemberType;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Random;

// Member 테이블에 더미 데이터를 추가하며,
// 아래 코드로 생성되는 memberType은 모두 BUSINESS입니다. (MemberType.BUSINESS)
public class BusinessMemberGenerator {

	private static final long START_ID = 9010L;
	private static final long END_ID = 9439L;
	private static final String DEFAULT_PASSWORD_HASH =
			"$2a$10$gJEEMOZajLkl4IERahBMvuOeL7dfTimmZQ/nFJWMy8x3kLvB2lYxu";
	private static final String INSERT_MEMBER_SQL = """
			INSERT IGNORE INTO member
			(id, name, birth_date, gender, phone, email, image, password, member_type, rating_sum, rating_count)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			""";

	public List<Member> generateMembers() {
		Random random = new Random(20260425L);
		List<Member> members = new ArrayList<>((int) (END_ID - START_ID + 1));

		for (long id = START_ID; id <= END_ID; id++) {
			LocalDate birthDate = randomBirthDate(random);
			Gender gender = random.nextBoolean() ? Gender.MALE : Gender.FEMALE;
			String phone = buildPhone(id, random);
			String email = "member" + id + "@dummy.local";

			Member member = new Member();
			member.setId(id);
			member.setName("DummyUser" + id);
			member.setBirthDate(birthDate);
			member.setGender(gender);
			member.setPhone(phone);
			member.setEmail(email);
			member.setImage(null);
			member.setPassword(DEFAULT_PASSWORD_HASH);
			member.setMemberType(MemberType.BUSINESS);
			member.setRatingSum(0);
			member.setRatingCount(0);

			members.add(member);
		}

		return members;
	}

	public int insertGeneratedMembers(JdbcTemplate jdbcTemplate) {
		Objects.requireNonNull(jdbcTemplate, "jdbcTemplate must not be null");
		List<Member> members = generateMembers();

		int[][] results = jdbcTemplate.batchUpdate(
				INSERT_MEMBER_SQL,
				members,
				100,
				(ps, member) -> {
					ps.setLong(1, member.getId());
					ps.setString(2, member.getName());
					ps.setDate(3, Date.valueOf(member.getBirthDate()));
					ps.setString(4, member.getGender().name());
					ps.setString(5, member.getPhone());
					ps.setString(6, member.getEmail());
					ps.setString(7, member.getImage());
					ps.setString(8, member.getPassword());
					ps.setString(9, member.getMemberType().name());
					ps.setInt(10, member.getRatingSum());
					ps.setInt(11, member.getRatingCount());
				}
		);

		return Arrays.stream(results)
				.flatMapToInt(Arrays::stream)
				.sum();
	}

	private LocalDate randomBirthDate(Random random) {
		int startYear = 1970;
		int endYear = 2002;
		int year = startYear + random.nextInt(endYear - startYear + 1);
		int dayOfYear = 1 + random.nextInt(LocalDate.ofYearDay(year, 1).lengthOfYear());
		return LocalDate.ofYearDay(year, dayOfYear);
	}

	private String buildPhone(long id, Random random) {
		long tail = id - START_ID;
		int middle = random.nextInt(8999) + 1000;
		int last = (int) (id % 10000);
		return String.format("010-%04d-%04d", middle, last);
	}
}
