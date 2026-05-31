package com.nextafield.shopease.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nextafield.shopease.dto.CartItem;
import com.nextafield.shopease.entity.Product;
import com.nextafield.shopease.repository
        .ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core
        .RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final RedisTemplate<String, Object>
            redisTemplate;
    private final ProductRepository productRepository;

    private static final String CART_PREFIX = "cart:";
    private static final String ANON_PREFIX = "anon:";
    private static final long AUTH_TTL_DAYS = 30;
    private static final long ANON_TTL_HOURS = 24;

    // For authenticated users
    private String getCartKey(String sessionId) {
        return CART_PREFIX + sessionId;
    }

    // For anonymous users
    private String getAnonCartKey(String sessionId) {
        return ANON_PREFIX + sessionId;
    }

    public void addToCart(
            String sessionId,
            Long productId,
            Integer quantity,
            boolean isAnonymous) {

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found!"));

        CartItem item = new CartItem();
        item.setProductId(productId);
        item.setTitle(product.getTitle());
        item.setBrand(product.getBrand());
        item.setPrice(product.getPrice()
                .getAmount().doubleValue());
        item.setCurrency(
                product.getPrice().getCurrency());
        item.setQuantity(quantity);

        String cartKey = isAnonymous
                ? getAnonCartKey(sessionId)
                : getCartKey(sessionId);

        redisTemplate.opsForHash().put(
                cartKey, productId.toString(), item);

        // TTL: 24hrs for anonymous, 30 days for auth
        if (isAnonymous) {
            redisTemplate.expire(cartKey,
                    ANON_TTL_HOURS, TimeUnit.HOURS);
        } else {
            redisTemplate.expire(cartKey,
                    AUTH_TTL_DAYS, TimeUnit.DAYS);
        }

        log.info("Added to {} cart: {}",
                isAnonymous ? "anonymous" : "user",
                productId);
    }

    // Merge anonymous cart into user cart on login
    public void mergeCart(
            String anonSessionId,
            String userSessionId) {

        String anonKey = getAnonCartKey(anonSessionId);
        String userKey = getCartKey(userSessionId);

        Map<Object, Object> anonCart =
                redisTemplate.opsForHash().entries(anonKey);

        if (!anonCart.isEmpty()) {
            anonCart.forEach((productId, item) ->
                    redisTemplate.opsForHash().put(
                            userKey, productId, item));

            // Set 30 day TTL on merged cart
            redisTemplate.expire(userKey,
                    AUTH_TTL_DAYS, TimeUnit.DAYS);

            // Delete anonymous cart
            redisTemplate.delete(anonKey);

            log.info("Merged anonymous cart → " +
                    "user cart: {}", userSessionId);
        }
    }

    public void removeFromCart(
            String sessionId,
            Long productId,
            boolean isAnonymous) {
        String cartKey = isAnonymous
                ? getAnonCartKey(sessionId)
                : getCartKey(sessionId);
        redisTemplate.opsForHash().delete(
                cartKey, productId.toString());
    }

    public void updateQuantity(
            String sessionId,
            Long productId,
            Integer quantity,
            boolean isAnonymous) {
        String cartKey = isAnonymous
                ? getAnonCartKey(sessionId)
                : getCartKey(sessionId);
        CartItem item = (CartItem) redisTemplate
                .opsForHash()
                .get(cartKey, productId.toString());
        if (item != null) {
            item.setQuantity(quantity);
            redisTemplate.opsForHash().put(
                    cartKey, productId.toString(), item);
        }
    }

    public List<CartItem> getCart(
            String sessionId,
            boolean isAnonymous) {
        String cartKey = isAnonymous
                ? getAnonCartKey(sessionId)
                : getCartKey(sessionId);
        Map<Object, Object> cartMap =
                redisTemplate.opsForHash().entries(cartKey);

        ObjectMapper mapper = new ObjectMapper();
        return cartMap.values().stream()
                .map(v -> mapper.convertValue(v, CartItem.class))
                .toList();
    }

    public void clearCart(
            String sessionId,
            boolean isAnonymous) {
        String cartKey = isAnonymous
                ? getAnonCartKey(sessionId)
                : getCartKey(sessionId);
        redisTemplate.delete(cartKey);
    }

    public Double getCartTotal(
            String sessionId,
            boolean isAnonymous) {
        return getCart(sessionId, isAnonymous)
                .stream()
                .mapToDouble(item ->
                        item.getPrice() * item.getQuantity())
                .sum();
    }
}