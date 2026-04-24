package com.example.aibe5_project2_team7.brand;

import com.example.aibe5_project2_team7.brand.dto.*;
import com.example.aibe5_project2_team7.brand.response.BrandRecruitListResponse;
import com.example.aibe5_project2_team7.brand.entity.Brand;
import com.example.aibe5_project2_team7.region.Region;
import com.example.aibe5_project2_team7.region.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.Query;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BrandService {
    private final BrandRepository brandRepository;
    private final RegionRepository regionRepository;
    private final EntityManager entityManager;

    public List<BrandSearchAutoCompleteDto> getSearchList(String query) {
        // if query is null or blank return empty list
        if (query == null || query.trim().isEmpty()) return new ArrayList<>();

        String q = query.trim();

        // Single native query: prefer names that start with the query, then containing ones
        // Uses parameter binding to avoid SQL injection
        String sql = "SELECT * FROM Brand " +
                "WHERE LOWER(name) LIKE LOWER(:prefix) OR LOWER(name) LIKE LOWER(:contains) " +
                "ORDER BY CASE WHEN LOWER(name) LIKE LOWER(:prefix) THEN 0 ELSE 1 END, name ASC " +
                "LIMIT 4";

        Query nativeQ = entityManager.createNativeQuery(sql, Brand.class);
        nativeQ.setParameter("prefix", q + "%");
        nativeQ.setParameter("contains", "%" + q + "%");

        @SuppressWarnings("unchecked")
        List<Brand> list = nativeQ.getResultList();

        List<BrandSearchAutoCompleteDto> dtoList = new ArrayList<>();
        for (Brand brand : list) dtoList.add(BrandSearchAutoCompleteDto.of(brand));
        return dtoList;
    }

    public List<BrandRandomDto> getRandom8Brands() {
        List<Brand> brandList = brandRepository.findRandom8Brands();
        List<BrandRandomDto> brandRandomDtoList = new ArrayList<>();
        for(Brand brand : brandList) {
            brandRandomDtoList.add(BrandRandomDto.of(brand));
        }
        return brandRandomDtoList;
    }

    public List<BrandRecruitCountDto> getBrandAndRecruitCounts(com.example.aibe5_project2_team7.recruit.constant.BusinessTypeName businessType) {
        return brandRepository.findRecruitCountsByBusinessType(businessType);
    }

    public List<BrandUrgentDto> getRandom3UrgentBrands() {
        List<BrandUrgentProjection> rows = brandRepository.findRandom3UrgentBrandsNative();
        List<BrandUrgentDto> results = new ArrayList<>();
        for (BrandUrgentProjection p : rows) {
            Long id = p.getBrand_id();
            String name = p.getBrand_name();
            Long urgentCount = p.getUrgent_count() != null ? p.getUrgent_count() : 0L;
            String bannerImg = p.getBanner_img();
            results.add(new BrandUrgentDto(id, name, urgentCount, bannerImg));
        }
        return results;
    }

    public BrandSummaryDto getBrandSummary(Long brandId) {
        Brand brand = brandRepository.findBrandById(brandId)
                .orElseThrow(EntityNotFoundException::new);
        return BrandSummaryDto.of(brand);
    }
    
    public BrandRecruitListResponse<BrandShortRecruitDto> getBrandShortRecruitList(Long brandId, int page, Long regionId, List<String> workDates, List<String> workTimes, Boolean urgentOnly, String sort) {
        int pageIndex = Math.max(1, page) - 1;
        final int size = 20;
        int limit = size;
        int offset = pageIndex * size;

        // default sort: LATEST (created_at DESC)
        String orderSql = "r.created_at DESC";
        if (sort != null) {
            if (sort.equalsIgnoreCase("SALARY")) orderSql = "r.salary DESC";
            else if (sort.equalsIgnoreCase("DEADLINE")) orderSql = "r.deadline ASC";
            else if (sort.equalsIgnoreCase("LATEST")) orderSql = "r.created_at DESC";
        }

        // parse workDates -> List<java.sql.Date>
        List<java.sql.Date> dateParams = new ArrayList<>();
        if (workDates != null) {
            for (String wd : workDates) {
                if (wd == null) continue;
                String v = wd.trim();
                // treat quoted values as invalid (ignore)
                if ((v.startsWith("\"") && v.endsWith("\"")) || (v.startsWith("'") && v.endsWith("'"))) continue;
                try {
                    java.time.LocalDate ld = java.time.LocalDate.parse(v);
                    dateParams.add(java.sql.Date.valueOf(ld));
                } catch (Exception ex) {
                    // ignore invalid entries
                }
            }
        }

        // parse workTimes -> List<String> validated enum names
        List<String> timeParams = new ArrayList<>();
        if (workTimes != null) {
            for (String wt : workTimes) {
                if (wt == null) continue;
                String v = wt.trim();
                if ((v.startsWith("\"") && v.endsWith("\"")) || (v.startsWith("'") && v.endsWith("'"))) continue;
                try {
                    String name = com.example.aibe5_project2_team7.recruit.constant.Times.valueOf(v.toUpperCase()).name();
                    timeParams.add(name);
                } catch (Exception ex) {
                    // fallback: case-insensitive match
                    for (com.example.aibe5_project2_team7.recruit.constant.Times t : com.example.aibe5_project2_team7.recruit.constant.Times.values()) {
                        if (t.name().equalsIgnoreCase(v)) {
                            timeParams.add(t.name());
                            break;
                        }
                    }
                }
            }
        }

        StringBuilder fromWhere = new StringBuilder();
        fromWhere.append(" FROM recruit r ");
        fromWhere.append(" JOIN Brand b ON r.brand_id = b.id ");
        fromWhere.append(" JOIN region rg ON r.region_id = rg.id ");
        fromWhere.append(" WHERE r.brand_id = :brandId AND r.recruit_status = 'OPEN' ");
        fromWhere.append(" AND (:regionId IS NULL OR r.region_id = :regionId) ");

        if (Boolean.TRUE.equals(urgentOnly)) {
            fromWhere.append(" AND r.is_urgent = TRUE ");
        }

        if (!dateParams.isEmpty()) {
            fromWhere.append(" AND DATE(r.deadline) IN (");
            for (int i = 0; i < dateParams.size(); i++) {
                if (i > 0) fromWhere.append(", ");
                fromWhere.append(":d").append(i);
            }
            fromWhere.append(") ");
        }

        if (!timeParams.isEmpty()) {
            fromWhere.append(" AND EXISTS (SELECT 1 FROM work_time wt2 WHERE wt2.recruit_id = r.id AND wt2.times IN (");
            for (int i = 0; i < timeParams.size(); i++) {
                if (i > 0) fromWhere.append(", ");
                fromWhere.append(":t").append(i);
            }
            fromWhere.append(") ) ");
        }

        fromWhere.append(" AND EXISTS (SELECT 1 FROM work_period wp WHERE wp.recruit_id = r.id AND wp.period = 'OneDay') ");

        // count query
        String countSql = "SELECT COUNT(DISTINCT r.id)" + fromWhere.toString();
        Query countQ = entityManager.createNativeQuery(countSql);
        countQ.setParameter("brandId", brandId);
        countQ.setParameter("regionId", regionId);
        for (int i = 0; i < dateParams.size(); i++) countQ.setParameter("d" + i, dateParams.get(i));
        for (int i = 0; i < timeParams.size(); i++) countQ.setParameter("t" + i, timeParams.get(i));
        Number totalCountNum = ((Number) countQ.getSingleResult());
        long totalCount = totalCountNum != null ? totalCountNum.longValue() : 0L;

        // data query (short list) - select fields in order matching mapping
        StringBuilder selectSql = new StringBuilder();
        selectSql.append("SELECT r.id, r.title, (SELECT bp.company_name FROM business_profile bp WHERE bp.member_id = r.business_member_id LIMIT 1) AS company_name, r.salary, ");
        selectSql.append(" (SELECT wt2.times FROM work_time wt2 WHERE wt2.recruit_id = r.id LIMIT 1) AS work_time, ");
        selectSql.append(" r.region_id, CONCAT(rg.sido, ' ', rg.sigungu) AS region_name, r.is_urgent, r.created_at, r.deadline ");
        selectSql.append(fromWhere.toString());
        selectSql.append(" ORDER BY ").append(orderSql).append(" LIMIT :limit OFFSET :offset");

        Query q = entityManager.createNativeQuery(selectSql.toString());
        q.setParameter("brandId", brandId);
        q.setParameter("regionId", regionId);
        for (int i = 0; i < dateParams.size(); i++) q.setParameter("d" + i, dateParams.get(i));
        for (int i = 0; i < timeParams.size(); i++) q.setParameter("t" + i, timeParams.get(i));
        q.setParameter("limit", limit);
        q.setParameter("offset", offset);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();

        List<BrandShortRecruitDto> results = new ArrayList<>();
        java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        for (Object[] row : rows) {
            BrandShortRecruitDto dto = new BrandShortRecruitDto();
            Number idNum = (Number) row[0];
            dto.setId(idNum != null ? idNum.longValue() : null);
            dto.setTitle((String) row[1]);
            dto.setCompanyName((String) row[2]);
            Number sal = (Number) row[3];
            dto.setSalary(sal != null ? sal.intValue() : null);

            String workTimeStr = row[4] != null ? row[4].toString() : null;
            if (workTimeStr != null) {
                try {
                    dto.setWorkTime(com.example.aibe5_project2_team7.recruit.constant.Times.valueOf(workTimeStr));
                } catch (Exception ex) {
                    // leave null if unrecognized
                }
            }

            Number regionNum = (Number) row[5];
            dto.setRegionId(regionNum != null ? regionNum.longValue() : null);
            dto.setRegionName((String) row[6]);

            Object urgentObj = row[7];
            boolean isUrgent = false;
            if (urgentObj instanceof Boolean) isUrgent = (Boolean) urgentObj;
            else if (urgentObj instanceof Number) isUrgent = ((Number) urgentObj).intValue() != 0;
            dto.setIsUrgent(isUrgent ? "Y" : "N");

            Object createdAtObj = row[8];
            Object deadlineObj = row[9];
            // set createdAt from DB created_at column when available
            if (createdAtObj instanceof java.sql.Timestamp) {
                java.time.LocalDateTime ldt = ((java.sql.Timestamp) createdAtObj).toLocalDateTime();
                dto.setCreatedAt(ldt.format(dtf));
            } else if (createdAtObj instanceof java.sql.Date) {
                java.time.LocalDate ld = ((java.sql.Date) createdAtObj).toLocalDate();
                dto.setCreatedAt(ld.toString() + " 00:00:00");
            } else if (createdAtObj != null) {
                dto.setCreatedAt(createdAtObj.toString());
            } else {
                dto.setCreatedAt(null);
            }

            if (deadlineObj instanceof java.sql.Timestamp) {
                java.time.LocalDateTime ldt = ((java.sql.Timestamp) deadlineObj).toLocalDateTime();
                dto.setDeadline(ldt.format(dtf));
            } else if (deadlineObj instanceof java.sql.Date) {
                java.time.LocalDate ld = ((java.sql.Date) deadlineObj).toLocalDate();
                dto.setDeadline(ld.toString());
            } else if (deadlineObj != null) {
                dto.setDeadline(deadlineObj.toString());
            } else {
                dto.setDeadline(null);
            }

            results.add(dto);
        }

        int currentPage = Math.max(1, page);
        int totalPages = totalCount == 0 ? 0 : (int) ((totalCount + size - 1) / size);

        // wrap results and pagination metadata
        BrandRecruitListResponse<BrandShortRecruitDto> resp = new BrandRecruitListResponse<>(results, totalCount, currentPage, totalPages, size);
        return resp;
    }

    public BrandRecruitListResponse<BrandLongRecruitDto> getBrandLongRecruits(Long brandId, int page, Long regionId,
                                                                             List<String> workPeriods, List<String> workTimes,
                                                                             List<String> workDays, List<String> excludeDays, String sort) {
        int pageIndex = Math.max(1, page) - 1;
        final int size = 20;
        int offset = pageIndex * size;

        String orderSql = "r.created_at DESC"; // default LATEST
        if (sort != null) {
            if (sort.equalsIgnoreCase("SALARY")) orderSql = "r.salary DESC";
            else if (sort.equalsIgnoreCase("DEADLINE")) orderSql = "r.deadline ASC";
        }

        // parse workPeriods -> validated Period names
        List<String> periodParams = new ArrayList<>();
        if (workPeriods != null) {
            for (String p : workPeriods) {
                if (p == null) continue;
                String v = p.trim();
                try { periodParams.add(com.example.aibe5_project2_team7.recruit.constant.Period.valueOf(v).name()); }
                catch (Exception ex) { /* ignore invalid */ }
            }
        }

        // parse workTimes -> validated Times names
        List<String> timeParams = new ArrayList<>();
        if (workTimes != null) {
            for (String wt : workTimes) {
                if (wt == null) continue;
                String v = wt.trim();
                try { timeParams.add(com.example.aibe5_project2_team7.recruit.constant.Times.valueOf(v).name()); }
                catch (Exception ex) { /* ignore invalid */ }
            }
        }

        // parse workDays -> validated Days names
        List<String> dayParams = new ArrayList<>();
        if (workDays != null) {
            for (String d : workDays) {
                if (d == null) continue;
                String v = d.trim();
                try { dayParams.add(com.example.aibe5_project2_team7.recruit.constant.Days.valueOf(v).name()); }
                catch (Exception ex) { /* ignore invalid */ }
            }
        }

        // parse excludeDays -> validated Days names
        List<String> excludeDayParams = new ArrayList<>();
        if (excludeDays != null) {
            for (String d : excludeDays) {
                if (d == null) continue;
                String v = d.trim();
                try { excludeDayParams.add(com.example.aibe5_project2_team7.recruit.constant.Days.valueOf(v).name()); }
                catch (Exception ex) { /* ignore invalid */ }
            }
        }

        StringBuilder fromWhere = new StringBuilder();
        fromWhere.append(" FROM recruit r ");
        fromWhere.append(" JOIN Brand b ON r.brand_id = b.id ");
        fromWhere.append(" JOIN region rg ON r.region_id = rg.id ");
        fromWhere.append(" WHERE r.brand_id = :brandId AND r.recruit_status = 'OPEN' ");
        fromWhere.append(" AND (:regionId IS NULL OR r.region_id = :regionId) ");

        if (!periodParams.isEmpty()) {
            fromWhere.append(" AND EXISTS (SELECT 1 FROM work_period wp WHERE wp.recruit_id = r.id AND wp.period IN (");
            for (int i = 0; i < periodParams.size(); i++) { if (i > 0) fromWhere.append(", "); fromWhere.append(":p").append(i); }
            fromWhere.append(") ) ");
        }

        if (!timeParams.isEmpty()) {
            fromWhere.append(" AND EXISTS (SELECT 1 FROM work_time wt2 WHERE wt2.recruit_id = r.id AND wt2.times IN (");
            for (int i = 0; i < timeParams.size(); i++) { if (i > 0) fromWhere.append(", "); fromWhere.append(":t").append(i); }
            fromWhere.append(") ) ");
        }

        if (!dayParams.isEmpty()) {
            fromWhere.append(" AND EXISTS (SELECT 1 FROM work_days wd WHERE wd.recruit_id = r.id AND wd.day IN (");
            for (int i = 0; i < dayParams.size(); i++) { if (i > 0) fromWhere.append(", "); fromWhere.append(":d").append(i); }
            fromWhere.append(") ) ");
        }

        if (!excludeDayParams.isEmpty()) {
            fromWhere.append(" AND NOT EXISTS (SELECT 1 FROM work_days wd_ex WHERE wd_ex.recruit_id = r.id AND wd_ex.day IN (");
            for (int i = 0; i < excludeDayParams.size(); i++) { if (i > 0) fromWhere.append(", "); fromWhere.append(":xd").append(i); }
            fromWhere.append(") ) ");
        }

        // exclude recruits whose work_period is OneDay
        fromWhere.append(" AND NOT EXISTS (SELECT 1 FROM work_period wp WHERE wp.recruit_id = r.id AND wp.period = 'OneDay') ");

        // count
        String countSql = "SELECT COUNT(DISTINCT r.id)" + fromWhere.toString();
        Query countQ = entityManager.createNativeQuery(countSql);
        countQ.setParameter("brandId", brandId);
        countQ.setParameter("regionId", regionId);
        for (int i = 0; i < periodParams.size(); i++) countQ.setParameter("p" + i, periodParams.get(i));
        for (int i = 0; i < timeParams.size(); i++) countQ.setParameter("t" + i, timeParams.get(i));
        for (int i = 0; i < dayParams.size(); i++) countQ.setParameter("d" + i, dayParams.get(i));
        for (int i = 0; i < excludeDayParams.size(); i++) countQ.setParameter("xd" + i, excludeDayParams.get(i));
        Number tcNum = (Number) countQ.getSingleResult();
        long totalCount = tcNum != null ? tcNum.longValue() : 0L;

        // select (include salary_type and work_period); work_days will be fetched separately
        StringBuilder selectSql = new StringBuilder();
        selectSql.append("SELECT r.id, r.title, (SELECT bp.company_name FROM business_profile bp WHERE bp.member_id = r.business_member_id LIMIT 1) AS company_name, r.salary, r.salary_type, ");
        selectSql.append(" (SELECT wp.period FROM work_period wp WHERE wp.recruit_id = r.id LIMIT 1) AS work_period, ");
        selectSql.append(" (SELECT wt2.times FROM work_time wt2 WHERE wt2.recruit_id = r.id LIMIT 1) AS work_time, ");
        selectSql.append(" r.region_id, CONCAT(rg.sido, ' ', rg.sigungu) AS region_name, r.is_urgent, r.created_at, r.deadline ");
        selectSql.append(fromWhere.toString());
        selectSql.append(" ORDER BY ").append(orderSql).append(" LIMIT :limit OFFSET :offset");

        Query q = entityManager.createNativeQuery(selectSql.toString());
        q.setParameter("brandId", brandId);
        q.setParameter("regionId", regionId);
        for (int i = 0; i < periodParams.size(); i++) q.setParameter("p" + i, periodParams.get(i));
        for (int i = 0; i < timeParams.size(); i++) q.setParameter("t" + i, timeParams.get(i));
        for (int i = 0; i < dayParams.size(); i++) q.setParameter("d" + i, dayParams.get(i));
        for (int i = 0; i < excludeDayParams.size(); i++) q.setParameter("xd" + i, excludeDayParams.get(i));
        q.setParameter("limit", size);
        q.setParameter("offset", offset);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();

        List<BrandLongRecruitDto> results = new ArrayList<>();
        List<Long> recruitIds = new ArrayList<>();
        java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        for (Object[] row : rows) {
            BrandLongRecruitDto dto = new BrandLongRecruitDto();
            Number idNum = (Number) row[0];
            Long rid = idNum != null ? idNum.longValue() : null;
            dto.setId(rid);
            recruitIds.add(rid);
            dto.setTitle((String) row[1]);
            dto.setCompanyName((String) row[2]);
            Number sal = (Number) row[3]; dto.setSalary(sal != null ? sal.intValue() : null);

            Object salaryTypeObj = row[4];
            if (salaryTypeObj != null) {
                try { dto.setSalaryType(com.example.aibe5_project2_team7.recruit.constant.SalaryType.valueOf(salaryTypeObj.toString())); }
                catch (Exception ex) { /* ignore */ }
            }

            Object wpObj = row[5];
            if (wpObj != null) {
                try { dto.setWorkPeriod(com.example.aibe5_project2_team7.recruit.constant.Period.valueOf(wpObj.toString())); }
                catch (Exception ex) { /* ignore */ }
            }

            String wts = row[6] != null ? row[6].toString() : null;
            if (wts != null) {
                try { dto.setWorkTime(com.example.aibe5_project2_team7.recruit.constant.Times.valueOf(wts)); } catch (Exception ex) { /* ignore */ }
            }

            Number regionNum = (Number) row[7]; dto.setRegionId(regionNum != null ? regionNum.longValue() : null);
            dto.setRegionName((String) row[8]);
            Object urgentObj = row[9]; boolean isUrgent = false; if (urgentObj instanceof Boolean) isUrgent = (Boolean) urgentObj; else if (urgentObj instanceof Number) isUrgent = ((Number) urgentObj).intValue() != 0;
            dto.setIsUrgent(isUrgent ? "Y" : "N");
            Object createdAtObj = row[10];
            Object deadlineObj = row[11];
            // createdAt from DB
            if (createdAtObj instanceof java.sql.Timestamp) {
                dto.setCreatedAt(((java.sql.Timestamp) createdAtObj).toLocalDateTime().format(dtf));
            } else if (createdAtObj instanceof java.sql.Date) {
                dto.setCreatedAt(((java.sql.Date) createdAtObj).toLocalDate().toString() + " 00:00:00");
            } else if (createdAtObj != null) {
                dto.setCreatedAt(createdAtObj.toString());
            } else {
                dto.setCreatedAt(null);
            }

            if (deadlineObj instanceof java.sql.Timestamp) dto.setDeadline(((java.sql.Timestamp) deadlineObj).toLocalDateTime().format(dtf));
            else if (deadlineObj instanceof java.sql.Date) dto.setDeadline(((java.sql.Date) deadlineObj).toLocalDate().toString());
            else if (deadlineObj != null) dto.setDeadline(deadlineObj.toString());
            else dto.setDeadline(null);
            results.add(dto);
        }

        // fetch work_days for recruits in page and map to DTO.days
        if (!recruitIds.isEmpty()) {
            StringBuilder daysSql = new StringBuilder();
            daysSql.append("SELECT recruit_id, day FROM work_days WHERE recruit_id IN (");
            for (int i = 0; i < recruitIds.size(); i++) {
                if (i > 0) daysSql.append(", ");
                daysSql.append(":id").append(i);
            }
            daysSql.append(")");
            Query daysQ = entityManager.createNativeQuery(daysSql.toString());
            for (int i = 0; i < recruitIds.size(); i++) daysQ.setParameter("id" + i, recruitIds.get(i));
            @SuppressWarnings("unchecked")
            List<Object[]> dayRows = daysQ.getResultList();
            java.util.Map<Long, List<com.example.aibe5_project2_team7.recruit.constant.Days>> dayMap = new java.util.HashMap<>();
            for (Object[] dr : dayRows) {
                Number ridNum = (Number) dr[0];
                String dayStr = dr[1] != null ? dr[1].toString() : null;
                if (ridNum == null || dayStr == null) continue;
                Long rid = ridNum.longValue();
                try {
                    com.example.aibe5_project2_team7.recruit.constant.Days dayEnum = com.example.aibe5_project2_team7.recruit.constant.Days.valueOf(dayStr);
                    dayMap.computeIfAbsent(rid, k -> new ArrayList<>()).add(dayEnum);
                } catch (Exception ex) {
                    // ignore invalid day
                }
            }
            // assign to DTOs
            for (BrandLongRecruitDto dto : results) {
                if (dto.getId() != null) {
                    List<com.example.aibe5_project2_team7.recruit.constant.Days> dlist = dayMap.get(dto.getId());
                    dto.setDays(dlist);
                }
            }
        }

        int currentPage = Math.max(1, page);
        int totalPages = totalCount == 0 ? 0 : (int) ((totalCount + size - 1) / size);

        BrandRecruitListResponse<BrandLongRecruitDto> resp = new BrandRecruitListResponse<>(results, totalCount, currentPage, totalPages, size);
        return resp;
    }

    public BrandRecruitListResponse<BrandCombinedRecruitDto> getBrandRecruits(
            Long brandId,
            int page,
            Long regionId,
            List<String> workTimes,
            String sort,
            List<String> workDates,
            Boolean urgentOnly,
            List<String> workPeriods,
            List<String> workDays,
            List<String> excludeDays
    ) {
        int pageIndex = Math.max(1, page) - 1;
        final int size = 20;
        int offset = pageIndex * size;

        String unionOrderSql = "u.created_at DESC";
        if (sort != null) {
            if (sort.equalsIgnoreCase("SALARY")) unionOrderSql = "u.salary DESC, u.created_at DESC";
            else if (sort.equalsIgnoreCase("DEADLINE")) unionOrderSql = "u.deadline ASC, u.created_at DESC";
        }

        List<java.sql.Date> shortDateParams = parseDates(workDates);
        List<String> commonTimeParams = parseEnumNames(workTimes, com.example.aibe5_project2_team7.recruit.constant.Times.class);
        List<String> longPeriodParams = parseEnumNames(workPeriods, com.example.aibe5_project2_team7.recruit.constant.Period.class);
        List<String> longDayParams = parseEnumNames(workDays, com.example.aibe5_project2_team7.recruit.constant.Days.class);
        List<String> longExcludeDayParams = parseEnumNames(excludeDays, com.example.aibe5_project2_team7.recruit.constant.Days.class);

        StringBuilder shortFromWhere = new StringBuilder();
        shortFromWhere.append(" FROM recruit r ");
        shortFromWhere.append(" JOIN Brand b ON r.brand_id = b.id ");
        shortFromWhere.append(" JOIN region rg ON r.region_id = rg.id ");
        shortFromWhere.append(" WHERE r.brand_id = :brandId AND r.recruit_status = 'OPEN' ");
        shortFromWhere.append(" AND (:regionId IS NULL OR r.region_id = :regionId) ");

        if (Boolean.TRUE.equals(urgentOnly)) {
            shortFromWhere.append(" AND r.is_urgent = TRUE ");
        }

        if (!shortDateParams.isEmpty()) {
            shortFromWhere.append(" AND DATE(r.deadline) IN (");
            for (int i = 0; i < shortDateParams.size(); i++) {
                if (i > 0) shortFromWhere.append(", ");
                shortFromWhere.append(":sd").append(i);
            }
            shortFromWhere.append(") ");
        }

        if (!commonTimeParams.isEmpty()) {
            shortFromWhere.append(" AND EXISTS (SELECT 1 FROM work_time wt2 WHERE wt2.recruit_id = r.id AND wt2.times IN (");
            for (int i = 0; i < commonTimeParams.size(); i++) {
                if (i > 0) shortFromWhere.append(", ");
                shortFromWhere.append(":ct").append(i);
            }
            shortFromWhere.append(") ) ");
        }

        // short filters are applied only to OneDay recruits
        shortFromWhere.append(" AND EXISTS (SELECT 1 FROM work_period wp WHERE wp.recruit_id = r.id AND wp.period = 'OneDay') ");

        StringBuilder longFromWhere = new StringBuilder();
        longFromWhere.append(" FROM recruit r ");
        longFromWhere.append(" JOIN Brand b ON r.brand_id = b.id ");
        longFromWhere.append(" JOIN region rg ON r.region_id = rg.id ");
        longFromWhere.append(" WHERE r.brand_id = :brandId AND r.recruit_status = 'OPEN' ");
        longFromWhere.append(" AND (:regionId IS NULL OR r.region_id = :regionId) ");

        if (!commonTimeParams.isEmpty()) {
            longFromWhere.append(" AND EXISTS (SELECT 1 FROM work_time wt2 WHERE wt2.recruit_id = r.id AND wt2.times IN (");
            for (int i = 0; i < commonTimeParams.size(); i++) {
                if (i > 0) longFromWhere.append(", ");
                longFromWhere.append(":ct").append(i);
            }
            longFromWhere.append(") ) ");
        }

        if (!longPeriodParams.isEmpty()) {
            longFromWhere.append(" AND EXISTS (SELECT 1 FROM work_period wp WHERE wp.recruit_id = r.id AND wp.period IN (");
            for (int i = 0; i < longPeriodParams.size(); i++) {
                if (i > 0) longFromWhere.append(", ");
                longFromWhere.append(":lp").append(i);
            }
            longFromWhere.append(") ) ");
        }

        if (!longDayParams.isEmpty()) {
            longFromWhere.append(" AND EXISTS (SELECT 1 FROM work_days wd WHERE wd.recruit_id = r.id AND wd.day IN (");
            for (int i = 0; i < longDayParams.size(); i++) {
                if (i > 0) longFromWhere.append(", ");
                longFromWhere.append(":ld").append(i);
            }
            longFromWhere.append(") ) ");
        }

        if (!longExcludeDayParams.isEmpty()) {
            longFromWhere.append(" AND NOT EXISTS (SELECT 1 FROM work_days wd_ex WHERE wd_ex.recruit_id = r.id AND wd_ex.day IN (");
            for (int i = 0; i < longExcludeDayParams.size(); i++) {
                if (i > 0) longFromWhere.append(", ");
                longFromWhere.append(":lxd").append(i);
            }
            longFromWhere.append(") ) ");
        }

        // long filters are applied only to non-OneDay recruits
        longFromWhere.append(" AND NOT EXISTS (SELECT 1 FROM work_period wp WHERE wp.recruit_id = r.id AND wp.period = 'OneDay') ");

        Query shortCountQ = entityManager.createNativeQuery("SELECT COUNT(DISTINCT r.id)" + shortFromWhere);
        shortCountQ.setParameter("brandId", brandId);
        shortCountQ.setParameter("regionId", regionId);
        for (int i = 0; i < shortDateParams.size(); i++) shortCountQ.setParameter("sd" + i, shortDateParams.get(i));
        for (int i = 0; i < commonTimeParams.size(); i++) shortCountQ.setParameter("ct" + i, commonTimeParams.get(i));
        Number shortCountNum = (Number) shortCountQ.getSingleResult();
        long shortCount = shortCountNum != null ? shortCountNum.longValue() : 0L;

        Query longCountQ = entityManager.createNativeQuery("SELECT COUNT(DISTINCT r.id)" + longFromWhere);
        longCountQ.setParameter("brandId", brandId);
        longCountQ.setParameter("regionId", regionId);
        for (int i = 0; i < commonTimeParams.size(); i++) longCountQ.setParameter("ct" + i, commonTimeParams.get(i));
        for (int i = 0; i < longPeriodParams.size(); i++) longCountQ.setParameter("lp" + i, longPeriodParams.get(i));
        for (int i = 0; i < longDayParams.size(); i++) longCountQ.setParameter("ld" + i, longDayParams.get(i));
        for (int i = 0; i < longExcludeDayParams.size(); i++) longCountQ.setParameter("lxd" + i, longExcludeDayParams.get(i));
        Number longCountNum = (Number) longCountQ.getSingleResult();
        long longCount = longCountNum != null ? longCountNum.longValue() : 0L;

        long totalCount = shortCount + longCount;

        StringBuilder shortSelect = new StringBuilder();
        shortSelect.append("SELECT r.id AS id, 'SHORT' AS recruit_type, r.title AS title, ");
        shortSelect.append("(SELECT bp.company_name FROM business_profile bp WHERE bp.member_id = r.business_member_id LIMIT 1) AS company_name, ");
        shortSelect.append("r.salary AS salary, NULL AS salary_type, NULL AS work_period, ");
        shortSelect.append("(SELECT wt2.times FROM work_time wt2 WHERE wt2.recruit_id = r.id LIMIT 1) AS work_time, ");
        shortSelect.append("r.region_id AS region_id, CONCAT(rg.sido, ' ', rg.sigungu) AS region_name, ");
        shortSelect.append("r.is_urgent AS is_urgent, r.created_at AS created_at, r.deadline AS deadline ");
        shortSelect.append(shortFromWhere);

        StringBuilder longSelect = new StringBuilder();
        longSelect.append("SELECT r.id AS id, 'LONG' AS recruit_type, r.title AS title, ");
        longSelect.append("(SELECT bp.company_name FROM business_profile bp WHERE bp.member_id = r.business_member_id LIMIT 1) AS company_name, ");
        longSelect.append("r.salary AS salary, r.salary_type AS salary_type, ");
        longSelect.append("(SELECT wp.period FROM work_period wp WHERE wp.recruit_id = r.id LIMIT 1) AS work_period, ");
        longSelect.append("(SELECT wt2.times FROM work_time wt2 WHERE wt2.recruit_id = r.id LIMIT 1) AS work_time, ");
        longSelect.append("r.region_id AS region_id, CONCAT(rg.sido, ' ', rg.sigungu) AS region_name, ");
        longSelect.append("r.is_urgent AS is_urgent, r.created_at AS created_at, r.deadline AS deadline ");
        longSelect.append(longFromWhere);

        String dataSql = "SELECT * FROM (" + shortSelect + " UNION ALL " + longSelect + ") u ORDER BY " + unionOrderSql + " LIMIT :limit OFFSET :offset";

        Query dataQ = entityManager.createNativeQuery(dataSql);
        dataQ.setParameter("brandId", brandId);
        dataQ.setParameter("regionId", regionId);
        for (int i = 0; i < shortDateParams.size(); i++) dataQ.setParameter("sd" + i, shortDateParams.get(i));
        for (int i = 0; i < commonTimeParams.size(); i++) dataQ.setParameter("ct" + i, commonTimeParams.get(i));
        for (int i = 0; i < longPeriodParams.size(); i++) dataQ.setParameter("lp" + i, longPeriodParams.get(i));
        for (int i = 0; i < longDayParams.size(); i++) dataQ.setParameter("ld" + i, longDayParams.get(i));
        for (int i = 0; i < longExcludeDayParams.size(); i++) dataQ.setParameter("lxd" + i, longExcludeDayParams.get(i));
        dataQ.setParameter("limit", size);
        dataQ.setParameter("offset", offset);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = dataQ.getResultList();

        List<BrandCombinedRecruitDto> results = new ArrayList<>();
        List<Long> longRecruitIds = new ArrayList<>();

        for (Object[] row : rows) {
            BrandCombinedRecruitDto dto = new BrandCombinedRecruitDto();
            Number idNum = (Number) row[0];
            Long recruitId = idNum != null ? idNum.longValue() : null;
            dto.setId(recruitId);

            String recruitType = row[1] != null ? row[1].toString() : null;
            dto.setRecruitType(recruitType);
            dto.setTitle((String) row[2]);
            dto.setCompanyName((String) row[3]);

            Number salaryNum = (Number) row[4];
            dto.setSalary(salaryNum != null ? salaryNum.intValue() : null);

            if (row[5] != null) {
                try {
                    dto.setSalaryType(com.example.aibe5_project2_team7.recruit.constant.SalaryType.valueOf(row[5].toString()));
                } catch (Exception ignored) {
                }
            }

            if (row[6] != null) {
                try {
                    dto.setWorkPeriod(com.example.aibe5_project2_team7.recruit.constant.Period.valueOf(row[6].toString()));
                } catch (Exception ignored) {
                }
            }

            if (row[7] != null) {
                try {
                    dto.setWorkTime(com.example.aibe5_project2_team7.recruit.constant.Times.valueOf(row[7].toString()));
                } catch (Exception ignored) {
                }
            }

            Number regionNum = (Number) row[8];
            dto.setRegionId(regionNum != null ? regionNum.longValue() : null);
            dto.setRegionName((String) row[9]);

            Object urgentObj = row[10];
            boolean isUrgent = false;
            if (urgentObj instanceof Boolean) isUrgent = (Boolean) urgentObj;
            else if (urgentObj instanceof Number) isUrgent = ((Number) urgentObj).intValue() != 0;
            dto.setIsUrgent(isUrgent ? "Y" : "N");

            dto.setCreatedAt(formatDateTimeValue(row[11], true));
            dto.setDeadline(formatDateTimeValue(row[12], false));

            if ("LONG".equalsIgnoreCase(recruitType) && recruitId != null) {
                longRecruitIds.add(recruitId);
            }

            results.add(dto);
        }

        if (!longRecruitIds.isEmpty()) {
            StringBuilder daysSql = new StringBuilder("SELECT recruit_id, day FROM work_days WHERE recruit_id IN (");
            for (int i = 0; i < longRecruitIds.size(); i++) {
                if (i > 0) daysSql.append(", ");
                daysSql.append(":id").append(i);
            }
            daysSql.append(")");
            Query daysQ = entityManager.createNativeQuery(daysSql.toString());
            for (int i = 0; i < longRecruitIds.size(); i++) daysQ.setParameter("id" + i, longRecruitIds.get(i));

            @SuppressWarnings("unchecked")
            List<Object[]> dayRows = daysQ.getResultList();
            java.util.Map<Long, List<com.example.aibe5_project2_team7.recruit.constant.Days>> dayMap = new java.util.HashMap<>();
            for (Object[] dayRow : dayRows) {
                Number recruitIdNum = (Number) dayRow[0];
                String dayStr = dayRow[1] != null ? dayRow[1].toString() : null;
                if (recruitIdNum == null || dayStr == null) continue;
                try {
                    com.example.aibe5_project2_team7.recruit.constant.Days dayEnum = com.example.aibe5_project2_team7.recruit.constant.Days.valueOf(dayStr);
                    dayMap.computeIfAbsent(recruitIdNum.longValue(), k -> new ArrayList<>()).add(dayEnum);
                } catch (Exception ignored) {
                }
            }

            for (BrandCombinedRecruitDto dto : results) {
                if (dto.getId() != null && "LONG".equalsIgnoreCase(dto.getRecruitType())) {
                    dto.setDays(dayMap.get(dto.getId()));
                }
            }
        }

        int currentPage = Math.max(1, page);
        int totalPages = totalCount == 0 ? 0 : (int) ((totalCount + size - 1) / size);
        return new BrandRecruitListResponse<>(results, totalCount, currentPage, totalPages, size);
    }

    private List<java.sql.Date> parseDates(List<String> rawDates) {
        List<java.sql.Date> results = new ArrayList<>();
        if (rawDates == null) return results;

        for (String raw : rawDates) {
            if (raw == null) continue;
            String value = raw.trim();
            if (value.isEmpty() || isQuoted(value)) continue;
            try {
                java.time.LocalDate localDate = java.time.LocalDate.parse(value);
                results.add(java.sql.Date.valueOf(localDate));
            } catch (Exception ignored) {
            }
        }
        return results;
    }

    private <E extends Enum<E>> List<String> parseEnumNames(List<String> rawValues, Class<E> enumType) {
        List<String> results = new ArrayList<>();
        if (rawValues == null) return results;

        for (String raw : rawValues) {
            if (raw == null) continue;
            String value = raw.trim();
            if (value.isEmpty() || isQuoted(value)) continue;

            E matched = null;
            for (E candidate : enumType.getEnumConstants()) {
                if (candidate.name().equalsIgnoreCase(value)) {
                    matched = candidate;
                    break;
                }
            }

            if (matched != null) {
                results.add(matched.name());
            }
        }
        return results;
    }

    private boolean isQuoted(String value) {
        return (value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"));
    }

    private String formatDateTimeValue(Object value, boolean includeTimeForDate) {
        java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        if (value instanceof java.sql.Timestamp) {
            return ((java.sql.Timestamp) value).toLocalDateTime().format(dtf);
        }
        if (value instanceof java.sql.Date) {
            String date = ((java.sql.Date) value).toLocalDate().toString();
            return includeTimeForDate ? date + " 00:00:00" : date;
        }
        return value != null ? value.toString() : null;
    }

    public List<Region> getRegionsBySido(String sido) {
        return regionRepository.findBySido(sido);
    }
}
