package com.nextafield.shopease.service;

import com.nextafield.shopease.entity.Product;
import com.nextafield.shopease.repository
        .ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation
        .Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ElasticsearchIndexService
            elasticsearchIndexService;

    @Transactional
    public Product saveProduct(Product product) {
        // Save to PostgreSQL first
        Product saved = productRepository.save(product);

        // Then index in Elasticsearch
        elasticsearchIndexService.indexProduct(saved);

        log.info("Product saved and indexed: {}",
                saved.getId());
        return saved;
    }

    @Transactional
    public void deleteProduct(Long id) {
        // Delete from PostgreSQL
        productRepository.deleteById(id);

        // Delete from Elasticsearch
        elasticsearchIndexService.deleteProduct(id);

        log.info("Product deleted: {}", id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found: " + id));
    }
}