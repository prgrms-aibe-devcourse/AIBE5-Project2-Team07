package com.example.aibe5_project2_team7.dummyGenerator;

import com.example.aibe5_project2_team7.dummyGenerator.member.BusinessMemberGenerator;
import com.example.aibe5_project2_team7.dummyGenerator.member.BusinessMemberAddressGenerator;
import com.example.aibe5_project2_team7.dummyGenerator.business_profile.BusinessProfileGenerator;
import com.example.aibe5_project2_team7.dummyGenerator.recruit.RecruitGenerator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@SpringBootTest
@Transactional
class DummyGeneratorRunTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @Commit
    @DisplayName("Generator 일괄 실행")
    void runAllGenerators() {
        int totalInserted = 0;

        for (GeneratorStep step : generatorSteps()) {
            int inserted = step.runner().run(jdbcTemplate);
            totalInserted += inserted;
            System.out.println(step.name() + " inserted = " + inserted);
        }

        System.out.println("TOTAL inserted = " + totalInserted);
    }

    private List<GeneratorStep> generatorSteps() {
        return List.of(
                // Section 1
//                new GeneratorStep("BusinessMemberGenerator", new BusinessMemberGenerator()::insertGeneratedMembers),
//             new GeneratorStep("BusinessMemberAddressGenerator", new BusinessMemberAddressGenerator()::insertGeneratedMemberAddresses),
//                new GeneratorStep("BusinessProfileGenerator", new BusinessProfileGenerator()::insertGeneratedBusinessProfiles)

                // Section 2
                new GeneratorStep("RecruitGenerator", new RecruitGenerator()::insertGeneratedRecruits)

                // 여기에 다른 Generator를 계속 추가하면 한 번에 실행됩니다.
                // 예) new GeneratorStep("OtherGenerator", new OtherGenerator()::insertGeneratedXxx)
        );
    }

    @FunctionalInterface
    private interface GeneratorRunner {
        int run(JdbcTemplate jdbcTemplate);
    }

    private record GeneratorStep(String name, GeneratorRunner runner) {
    }
}

