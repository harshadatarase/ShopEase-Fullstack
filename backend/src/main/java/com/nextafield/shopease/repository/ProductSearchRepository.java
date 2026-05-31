package com.nextafield.shopease.repository;

import com.nextafield.shopease.document.ProductDocument;
import org.springframework.data.elasticsearch.repository
        .ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductSearchRepository
        extends ElasticsearchRepository
        <ProductDocument, String> {

    List<ProductDocument> findByTitle(String title);

    List<ProductDocument> findByBrand(String brand);

    List<ProductDocument> findByCategoryId(
            Long categoryId);
}