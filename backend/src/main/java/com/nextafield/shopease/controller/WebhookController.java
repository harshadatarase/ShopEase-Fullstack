package com.nextafield.shopease.controller;

import com.nextafield.shopease.entity.StripeEvent;
import com.nextafield.shopease.repository
        .StripeEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    private final StripeEventRepository
            stripeEventRepository;

    @PostMapping("/razorpay")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature")
            String signature) {

        log.info("Razorpay webhook received!");

        // Store webhook event
        StripeEvent event = new StripeEvent();
        event.setStripeEventId(
                "rzp_" + System.currentTimeMillis());
        event.setEventType("razorpay.webhook");
        event.setPayload(payload);
        event.setStatus("RECEIVED");
        stripeEventRepository.save(event);

        return ResponseEntity.ok("Received!");
    }
}