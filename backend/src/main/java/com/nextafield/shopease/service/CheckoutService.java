package com.nextafield.shopease.service;

import com.nextafield.shopease.dto.CartItem;
import com.nextafield.shopease.dto.CheckoutResponse;
import com.nextafield.shopease.entity.Coupon;
import com.nextafield.shopease.entity.DiscountType;
import com.nextafield.shopease.entity.Product;
import com.nextafield.shopease.repository
        .CouponRepository;
import com.nextafield.shopease.repository
        .ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckoutService {

    private final CartService cartService;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;

    public CheckoutResponse calculateCheckout(
            String sessionId,
            boolean isAnonymous,
            String couponCode) {

        // Get cart items
        List<CartItem> cartItems =
                cartService.getCart(sessionId, isAnonymous);

        if (cartItems.isEmpty()) {
            throw new RuntimeException(
                    "Cart is empty!");
        }

        // Recalculate with LIVE prices from DB
        double subtotal = 0.0;
        for (CartItem item : cartItems) {
            Product product = productRepository
                    .findById(item.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Product not found!"));

            // Use fresh price from DB not cache!
            double livePrice = product.getPrice()
                    .getAmount().doubleValue();
            item.setPrice(livePrice);
            subtotal += livePrice * item.getQuantity();
        }

        // Apply coupon if provided
        double discount = 0.0;
        String couponMessage = null;

        if (couponCode != null
                && !couponCode.isEmpty()) {
            Coupon coupon = couponRepository
                    .findByCode(couponCode)
                    .orElse(null);

            if (coupon != null
                    && coupon.getActive()
                    && (coupon.getExpiryDate() == null
                    || coupon.getExpiryDate()
                    .isAfter(LocalDateTime.now()))) {

                if (coupon.getDiscountType()
                        == DiscountType.PERCENTAGE) {
                    discount = subtotal *
                            coupon.getDiscountValue()
                                    .doubleValue() / 100;
                } else {
                    discount = coupon.getDiscountValue()
                            .doubleValue();
                }
                couponMessage = "Coupon applied: "
                        + couponCode;
            } else {
                couponMessage =
                        "Invalid or expired coupon!";
            }
        }

        // Calculate tax (18% GST)
        double afterDiscount = subtotal - discount;
        double tax = afterDiscount * 0.18;
        double total = afterDiscount + tax;

        return new CheckoutResponse(
                cartItems,
                round(subtotal),
                round(discount),
                round(tax),
                round(total),
                couponMessage);
    }

    private double round(double value) {
        return BigDecimal.valueOf(value)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }
}