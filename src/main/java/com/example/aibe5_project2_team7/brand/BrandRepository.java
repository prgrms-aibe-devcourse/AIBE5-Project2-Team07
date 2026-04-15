package com.example.aibe5_project2_team7.brand;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    // Convenience method to return top 4 matching brands (case-insensitive)
    List<Brand> findTop4ByNameContainingIgnoreCaseOrderByNameAsc(String brandName);
    /*

    // Correct JPQL using CONCAT to include wildcards around the parameter
    @Query("select b from Brand b where b.name like CONCAT('%', :brandName, '%') order by b.name asc")
    List<Brand> findByBrandName(@Param("brandName") String brandName);
    */
}
