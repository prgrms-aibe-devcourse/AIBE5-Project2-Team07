package com.example.aibe5_project2_team7.brand;

import com.example.aibe5_project2_team7.brand.dto.*;
import com.example.aibe5_project2_team7.brand.response.BrandRecruitListResponse;
import com.example.aibe5_project2_team7.brand.entity.Brand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BrandService {
    private final BrandRepository brandRepository;
    private final EntityManager entityManager;

    public List<BrandSearchAutoCompleteDto> getSearchList(String query) {
        List<Brand> brandList;
        brandList = brandRepository.findTop4ByNameContainingIgnoreCaseOrderByNameAsc(query);
        List<BrandSearchAutoCompleteDto> brandSearchAutoCompleteDtoList = new ArrayList<>();
        for(Brand brand : brandList) {
            brandSearchAutoCompleteDtoList.add(BrandSearchAutoCompleteDto.of(brand));
        }
        return brandSearchAutoCompleteDtoList;
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
            results.add(new BrandUrgentDto(id, name, urgentCount));
        }
        return results;
    }
    
    public BrandRecruitListResponse<BrandShortRecruitDto> getBrandShortRecruitList(Long brandId, int page, Long regionId, List<String> workDates, List<String> workTimes, String sort) {
        int pageIndex = Math.max(1, page) - 1;
        final int size = 20;
        int limit = size;
        int offset = pageIndex * size;

        String orderSql = "r.salary DESC"; // default SALARY desc
        if (sort != null && sort.equalsIgnoreCase("DEADLINE")) {
            orderSql = "r.deadline ASC";
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
        selectSql.append("SELECT r.id, r.title, b.name AS company_name, r.salary, ");
        selectSql.append(" (SELECT wt2.times FROM work_time wt2 WHERE wt2.recruit_id = r.id LIMIT 1) AS work_time, ");
        selectSql.append(" r.region_id, CONCAT(rg.sido, ' ', rg.sigungu) AS region_name, r.is_urgent, r.deadline ");
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

            Object deadlineObj = row[8];
            // 요청에 따라 created_at은 고정값으로 설정하고 deadline 필드에 마감일을 넣습니다.
            dto.setCreatedAt("2026-04-17 10:00:00");
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

        // wrap results and totalCount
        BrandRecruitListResponse<BrandShortRecruitDto> resp = new BrandRecruitListResponse<>(results, totalCount);
        return resp;
    }

    public BrandRecruitListResponse<BrandLongRecruitDto> getBrandLongRecruits(Long brandId, int page, Long regionId,
                                                                             List<String> workPeriods, List<String> workTimes,
                                                                             List<String> workDays, String sort) {
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
        Number tcNum = (Number) countQ.getSingleResult();
        long totalCount = tcNum != null ? tcNum.longValue() : 0L;

        // select (include salary_type and work_period); work_days will be fetched separately
        StringBuilder selectSql = new StringBuilder();
        selectSql.append("SELECT r.id, r.title, b.name AS company_name, r.salary, r.salary_type, ");
        selectSql.append(" (SELECT wp.period FROM work_period wp WHERE wp.recruit_id = r.id LIMIT 1) AS work_period, ");
        selectSql.append(" (SELECT wt2.times FROM work_time wt2 WHERE wt2.recruit_id = r.id LIMIT 1) AS work_time, ");
        selectSql.append(" r.region_id, CONCAT(rg.sido, ' ', rg.sigungu) AS region_name, r.is_urgent, r.deadline ");
        selectSql.append(fromWhere.toString());
        selectSql.append(" ORDER BY ").append(orderSql).append(" LIMIT :limit OFFSET :offset");

        Query q = entityManager.createNativeQuery(selectSql.toString());
        q.setParameter("brandId", brandId);
        q.setParameter("regionId", regionId);
        for (int i = 0; i < periodParams.size(); i++) q.setParameter("p" + i, periodParams.get(i));
        for (int i = 0; i < timeParams.size(); i++) q.setParameter("t" + i, timeParams.get(i));
        for (int i = 0; i < dayParams.size(); i++) q.setParameter("d" + i, dayParams.get(i));
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
            Object deadlineObj = row[10];
            if (deadlineObj instanceof java.sql.Timestamp) dto.setDeadline(((java.sql.Timestamp) deadlineObj).toLocalDateTime().format(dtf));
            else if (deadlineObj instanceof java.sql.Date) dto.setDeadline(((java.sql.Date) deadlineObj).toLocalDate().toString());
            else if (deadlineObj != null) dto.setDeadline(deadlineObj.toString());
            else dto.setDeadline(null);

            dto.setCreatedAt("2026-04-17 10:00:00");
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

        BrandRecruitListResponse<BrandLongRecruitDto> resp = new BrandRecruitListResponse<>(results, totalCount);
        return resp;
    }
}
