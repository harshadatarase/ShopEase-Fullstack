package com.nextafield.shopease.dto;

import com.nextafield.shopease.document
        .ProductDocument;
import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResponse {

    private List<ProductDocument> products;
    private long totalHits;
    private Map<String, Long> brandCounts;
    private Map<String, Long> categoryCounts;
}