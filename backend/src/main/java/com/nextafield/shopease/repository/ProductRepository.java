package com.nextafield.shopease.repository;

import com.nextafield.shopease.entity.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository
        .JpaRepository;
import org.springframework.data.jpa.repository
        .Lock;
import org.springframework.data.jpa.repository
        .Query;
import org.springframework.data.repository.query
        .Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository
        extends JpaRepository<Product, Long> {

    List<Product> findByBrand(String brand);

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByTitleContainingIgnoreCase(
            String title);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p " +
            "WHERE p.id = :id")
    Optional<Product> findByIdWithLock(
            @Param("id") Long id);
}