package com.nextafield.shopease.controller;

import com.nextafield.shopease.document.ProductDocument;
import com.nextafield.shopease.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.nextafield.shopease.dto.SearchResponse;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<SearchResponse> search(
            @RequestParam String q,
            @RequestParam(required = false)
            String brand,
            @RequestParam(required = false)
            Long categoryId,
            @RequestParam(required = false)
            Double minPrice,
            @RequestParam(required = false)
            Double maxPrice,
            @RequestParam(defaultValue = "relevance")
            String sortBy) {

        SearchResponse results =
                searchService.search(
                        q, brand, categoryId,
                        minPrice, maxPrice, sortBy);

        return ResponseEntity.ok(results);
    }
    @GetMapping("/suggest")
    public ResponseEntity<List<String>> suggest(
            @RequestParam String q) {

        List<String> suggestions =
                searchService.suggest(q);

        return ResponseEntity.ok(suggestions);
    }
}