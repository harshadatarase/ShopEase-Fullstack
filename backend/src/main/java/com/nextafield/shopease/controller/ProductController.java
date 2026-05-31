package com.nextafield.shopease.controller;

import com.nextafield.shopease.entity.Product;
import com.nextafield.shopease.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(
                productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestBody Product product) {
        return ResponseEntity.ok(
                productService.saveProduct(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product updatedProduct) {
        Product existing =
                productService.getProductById(id);
        existing.setTitle(updatedProduct.getTitle());
        existing.setDescription(
                updatedProduct.getDescription());
        existing.setBrand(updatedProduct.getBrand());
        existing.setStockQuantity(
                updatedProduct.getStockQuantity());
        existing.setPrice(updatedProduct.getPrice());
        if (updatedProduct.getImageUrl() != null) {
            existing.setImageUrl(
                    updatedProduct.getImageUrl());
        }
        return ResponseEntity.ok(
                productService.saveProduct(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}