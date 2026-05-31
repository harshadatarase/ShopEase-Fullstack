package com.nextafield.shopease.controller;

import com.nextafield.shopease.dto.CartItem;
import com.nextafield.shopease.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(
            @RequestParam String sessionId,
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestParam(defaultValue = "true")
            boolean isAnonymous) {
        cartService.addToCart(
                sessionId, productId,
                quantity, isAnonymous);
        return ResponseEntity.ok(
                "Added to cart successfully!");
    }

    @PostMapping("/merge")
    public ResponseEntity<String> mergeCart(
            @RequestParam String anonSessionId,
            @RequestParam String userSessionId) {
        cartService.mergeCart(
                anonSessionId, userSessionId);
        return ResponseEntity.ok(
                "Cart merged successfully!");
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(
            @RequestParam String sessionId,
            @RequestParam(defaultValue = "true")
            boolean isAnonymous) {
        return ResponseEntity.ok(
                cartService.getCart(
                        sessionId, isAnonymous));
    }

    @GetMapping("/total")
    public ResponseEntity<Double> getCartTotal(
            @RequestParam String sessionId,
            @RequestParam(defaultValue = "true")
            boolean isAnonymous) {
        return ResponseEntity.ok(
                cartService.getCartTotal(
                        sessionId, isAnonymous));
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateQuantity(
            @RequestParam String sessionId,
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestParam(defaultValue = "true")
            boolean isAnonymous) {
        cartService.updateQuantity(
                sessionId, productId,
                quantity, isAnonymous);
        return ResponseEntity.ok("Cart updated!");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromCart(
            @RequestParam String sessionId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "true")
            boolean isAnonymous) {
        cartService.removeFromCart(
                sessionId, productId, isAnonymous);
        return ResponseEntity.ok(
                "Removed from cart!");
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(
            @RequestParam String sessionId,
            @RequestParam(defaultValue = "true")
            boolean isAnonymous) {
        cartService.clearCart(
                sessionId, isAnonymous);
        return ResponseEntity.ok("Cart cleared!");
    }
}