package com.nextafield.shopease.service;

import com.nextafield.shopease.document
        .ProductDocument;
import com.nextafield.shopease.dto.SearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core
        .ElasticsearchOperations;
import org.springframework.data.elasticsearch.core
        .SearchHits;
import org.springframework.data.elasticsearch.core
        .query.Criteria;
import org.springframework.data.elasticsearch.core
        .query.CriteriaQuery;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {

    private final ElasticsearchOperations
            elasticsearchOperations;

    public SearchResponse search(
            String query,
            String brand,
            Long categoryId,
            Double minPrice,
            Double maxPrice,
            String sortBy) {

        Criteria criteria = new Criteria("title")
                .matches(query)
                .or(new Criteria("description")
                        .matches(query));

        if (brand != null && !brand.isEmpty()) {
            criteria = criteria.and(
                    new Criteria("brand").is(brand));
        }

        if (categoryId != null) {
            criteria = criteria.and(
                    new Criteria("categoryId")
                            .is(categoryId));
        }

        if (minPrice != null && maxPrice != null) {
            criteria = criteria.and(
                    new Criteria("price")
                            .between(minPrice, maxPrice));
        } else if (minPrice != null) {
            criteria = criteria.and(
                    new Criteria("price")
                            .greaterThanEqual(minPrice));
        } else if (maxPrice != null) {
            criteria = criteria.and(
                    new Criteria("price")
                            .lessThanEqual(maxPrice));
        }

        CriteriaQuery criteriaQuery =
                new CriteriaQuery(criteria);

        if (sortBy != null) {
            switch (sortBy) {
                case "price_asc" ->
                        criteriaQuery.addSort(
                                Sort.by(Sort.Direction.ASC,
                                        "price"));
                case "price_desc" ->
                        criteriaQuery.addSort(
                                Sort.by(Sort.Direction.DESC,
                                        "price"));
                case "stock" ->
                        criteriaQuery.addSort(
                                Sort.by(Sort.Direction.DESC,
                                        "stockQuantity"));
                default ->
                        log.info("Sorting by relevance");
            }
        }

        SearchHits<ProductDocument> hits =
                elasticsearchOperations.search(
                        criteriaQuery, ProductDocument.class);

        List<ProductDocument> products = hits.stream()
                .map(hit -> hit.getContent())
                .collect(Collectors.toList());

        // Brand aggregation counts
        Map<String, Long> brandCounts = products
                .stream()
                .filter(p -> p.getBrand() != null)
                .collect(Collectors.groupingBy(
                        ProductDocument::getBrand,
                        Collectors.counting()));

        // Category aggregation counts
        Map<String, Long> categoryCounts = products
                .stream()
                .filter(p -> p.getCategoryName() != null)
                .collect(Collectors.groupingBy(
                        ProductDocument::getCategoryName,
                        Collectors.counting()));

        return SearchResponse.builder()
                .products(products)
                .totalHits(hits.getTotalHits())
                .brandCounts(brandCounts)
                .categoryCounts(categoryCounts)
                .build();
    }

    public List<String> suggest(String query) {

        Criteria criteria = new Criteria("title")
                .matches(query);

        CriteriaQuery criteriaQuery =
                new CriteriaQuery(criteria);

        // Get all products and filter by prefix
        SearchHits<ProductDocument> hits =
                elasticsearchOperations.search(
                        criteriaQuery, ProductDocument.class);

        // If no hits try broader search
        if (hits.getTotalHits() == 0) {
            criteria = new Criteria("description")
                    .matches(query);
            criteriaQuery = new CriteriaQuery(criteria);
            hits = elasticsearchOperations.search(
                    criteriaQuery, ProductDocument.class);
        }

        return hits.stream()
                .map(hit -> hit.getContent().getTitle())
                .distinct()
                .collect(Collectors.toList());
    }
}