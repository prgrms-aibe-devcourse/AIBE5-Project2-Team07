package com.example.aibe5_project2_team7.brand;

import com.example.aibe5_project2_team7.brand.dto.BrandRecruitCountDto;
import com.example.aibe5_project2_team7.brand.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    Optional<Brand> findBrandById(Long id);

    @Query(value = "select * from Brand order by rand() limit 8", nativeQuery = true)
    List<Brand> findRandom8Brands();

    @Query("select new com.example.aibe5_project2_team7.brand.dto.BrandRecruitCountDto(" +
            "b.id, b.name, " +
            "(select coalesce(count(r1), 0) from com.example.aibe5_project2_team7.recruit.entity.Recruit r1 where r1.brand = b and r1.status = com.example.aibe5_project2_team7.recruit.constant.RecruitStatus.OPEN and r1.isUrgent = true), " +
            "(select coalesce(count(r2), 0) from com.example.aibe5_project2_team7.recruit.entity.Recruit r2 where r2.brand = b and r2.status = com.example.aibe5_project2_team7.recruit.constant.RecruitStatus.OPEN and r2.isUrgent = false)" +
            ") from Brand b where b.businessType = :businessType order by b.name asc")
    List<BrandRecruitCountDto> findRecruitCountsByBusinessType(@Param("businessType") BusinessTypeName businessType);

    @Query(value = "SELECT b.id AS brand_id, b.name AS brand_name, COUNT(r.id) AS urgent_count " +
            "FROM recruit r JOIN Brand b ON r.brand_id = b.id " +
            "WHERE r.is_urgent = 1 AND r.recruit_status = 'OPEN' " +
            "GROUP BY b.id, b.name " +
            "ORDER BY RAND() " +
            "LIMIT 3", nativeQuery = true)
    List<BrandUrgentProjection> findRandom3UrgentBrandsNative();

    // dynamic short recruit listing is implemented in BrandService using a native query via EntityManager
}
