package com.nextafield.shopease.controller;

import com.nextafield.shopease.entity.Order;
import com.nextafield.shopease.entity.OrderStatus;
import com.nextafield.shopease.repository
        .OrderRepository;
import com.nextafield.shopease.service
        .RazorpayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final RazorpayService razorpayService;
    private final OrderRepository orderRepository;

    @PostMapping("/create-order")
    public ResponseEntity<String> createPaymentOrder(
            @RequestParam Long orderId) {

        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found!"));

        try {
            String razorpayOrder =
                    razorpayService.createOrder(
                            orderId,
                            order.getTotalAmount()
                                    .getAmount().doubleValue());

            return ResponseEntity.ok(razorpayOrder);

        } catch (Exception e) {
            log.error("Razorpay error: {}",
                    e.getMessage());
            return ResponseEntity
                    .internalServerError()
                    .body("Payment failed: "
                            + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpaySignature,
            @RequestParam Long orderId) {

        boolean isValid = razorpayService
                .verifyPayment(
                        razorpayOrderId,
                        razorpayPaymentId,
                        razorpaySignature);

        if (isValid) {
            Order order = orderRepository
                    .findById(orderId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Order not found!"));

            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);

            log.info("Payment verified for order: {}",
                    orderId);

            return ResponseEntity.ok(
                    "Payment verified! " +
                            "Order #" + orderId + " is PAID ✅");
        } else {
            return ResponseEntity
                    .badRequest()
                    .body("Payment verification failed!");
        }
    }

    @GetMapping("/success")
    public ResponseEntity<String> paymentSuccess(
            @RequestParam Long orderId) {
        return ResponseEntity.ok(
                "Payment successful! Order #"
                        + orderId + " ✅");
    }

    @GetMapping("/cancel")
    public ResponseEntity<String> paymentCancel() {
        return ResponseEntity.ok(
                "Payment cancelled!");
    }
}