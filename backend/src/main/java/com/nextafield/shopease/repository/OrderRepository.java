package com.nextafield.shopease.repository;

import com.nextafield.shopease.entity.Order;
import com.nextafield.shopease.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.List;



@Repository
public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findByCustomerId(Long customerId);

    List<Order> findByStatus(OrderStatus status);
}