package com.nextafield.shopease.controller;

import com.nextafield.shopease.entity.Order;
import com.nextafield.shopease.repository.OrderRepository;
import com.nextafield.shopease.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @PostMapping("/create")
    public ResponseEntity<String> createOrder(
            @RequestParam String sessionId,
            @RequestParam(defaultValue = "false")
            boolean isAnonymous,
            @RequestParam Long customerId,
            @RequestParam double total) {

        Order order = orderService.createOrder(
                sessionId, isAnonymous,
                customerId, total);

        return ResponseEntity.ok(
                "Order created! ID: " + order.getId()
                        + " Status: " + order.getStatus());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                orderRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found")));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getCustomerOrders(
            @PathVariable Long customerId) {
        return ResponseEntity.ok(
                orderRepository
                        .findByCustomerId(customerId));
    }
}