package com.nextafield.shopease.service;

import com.nextafield.shopease.document.ProductDocument;
import com.nextafield.shopease.entity.Product;
import com.nextafield.shopease.repository
        .ProductSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ElasticsearchIndexService {

    private final ProductSearchRepository
            productSearchRepository;

    public void indexProduct(Product product) {
        try {
            ProductDocument doc = convertToDocument(
                    product);
            productSearchRepository.save(doc);
            log.info("Product indexed in ES: {}",
                    product.getId());
        } catch (Exception e) {
            log.error(
                    "Failed to index product in ES: {}",
                    product.getId(), e);
        }
    }

    public void deleteProduct(Long productId) {
        try {
            productSearchRepository.deleteById(
                    productId.toString());
            log.info("Product deleted from ES: {}",
                    productId);
        } catch (Exception e) {
            log.error(
                    "Failed to delete product from ES: {}",
                    productId, e);
        }
    }

    private ProductDocument convertToDocument(
            Product product) {
        ProductDocument doc = new ProductDocument();
        doc.setId(product.getId().toString());
        doc.setTitle(product.getTitle());
        doc.setDescription(product.getDescription());
        doc.setBrand(product.getBrand());
        doc.setStockQuantity(product.getStockQuantity());

        if (product.getPrice() != null) {
            doc.setPrice(product.getPrice().getAmount());
            doc.setCurrency(
                    product.getPrice().getCurrency());
        }

        if (product.getCategory() != null) {
            doc.setCategoryId(
                    product.getCategory().getId());
            doc.setCategoryName(
                    product.getCategory().getName());
        }

        return doc;
    }
}