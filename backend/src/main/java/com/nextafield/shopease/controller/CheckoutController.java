package com.nextafield.shopease.controller;

import com.nextafield.shopease.dto.CheckoutResponse;
import com.nextafield.shopease.entity.Order;
import com.nextafield.shopease.service.CheckoutService;
import com.nextafield.shopease.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final OrderService orderService;

    @GetMapping("/calculate")
    public ResponseEntity<CheckoutResponse>
    calculateCheckout(
            @RequestParam String sessionId,
            @RequestParam(defaultValue = "true")
            boolean isAnonymous,
            @RequestParam(required = false)
            String couponCode) {

        return ResponseEntity.ok(
                checkoutService.calculateCheckout(
                        sessionId, isAnonymous, couponCode));
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmCheckout(
            @RequestParam String sessionId,
            @RequestParam(defaultValue = "false")
            boolean isAnonymous,
            @RequestParam Long customerId,
            @RequestParam(required = false)
            String couponCode) {

        CheckoutResponse checkout =
                checkoutService.calculateCheckout(
                        sessionId, isAnonymous, couponCode);

        Order order = orderService.createOrder(
                sessionId, isAnonymous,
                customerId, checkout.getTotal());

        return ResponseEntity.ok(
                "Order confirmed! ID: "
                        + order.getId()
                        + " Total: Rs."
                        + checkout.getTotal());
    }
}