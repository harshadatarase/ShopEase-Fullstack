package com.nextafield.shopease.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation
        .Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private RazorpayClient razorpayClient;

    @PostConstruct
    public void init() throws RazorpayException {
        razorpayClient = new RazorpayClient(
                keyId, keySecret);
        log.info("Razorpay client initialized!");
    }

    public String createOrder(
            Long orderId,
            double amount) throws RazorpayException {

        JSONObject orderRequest = new JSONObject();
        // Amount in paise (multiply by 100)
        orderRequest.put("amount",
                (int)(amount * 100));
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt",
                "order_" + orderId);
        orderRequest.put("payment_capture", 1);

        Order razorpayOrder = razorpayClient
                .orders.create(orderRequest);

        String razorpayOrderId =
                razorpayOrder.get("id").toString();
        log.info("Razorpay order created: {}",
                razorpayOrderId);
        return razorpayOrder.toString();
    }

    public boolean verifyPayment(
            String orderId,
            String paymentId,
            String signature) {

        try {
            String payload = orderId + "|" + paymentId;
            String generatedSignature =
                    generateHmacSha256(
                            payload, keySecret);
            return generatedSignature
                    .equals(signature);
        } catch (Exception e) {
            log.error("Payment verification failed: {}",
                    e.getMessage());
            return false;
        }
    }

    private String generateHmacSha256(
            String data, String secret)
            throws Exception {
        javax.crypto.Mac mac = javax.crypto.Mac
                .getInstance("HmacSHA256");
        javax.crypto.spec.SecretKeySpec secretKey =
                new javax.crypto.spec.SecretKeySpec(
                        secret.getBytes(), "HmacSHA256");
        mac.init(secretKey);
        byte[] hash = mac.doFinal(
                data.getBytes());
        StringBuilder hexString =
                new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(
                    0xff & b);
            if (hex.length() == 1)
                hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}