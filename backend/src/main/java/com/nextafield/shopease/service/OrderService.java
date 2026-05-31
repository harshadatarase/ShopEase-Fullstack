package com.nextafield.shopease.service;

import com.nextafield.shopease.dto.CartItem;
import com.nextafield.shopease.entity.*;
import com.nextafield.shopease.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation
        .Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final CartService cartService;

    @Transactional
    public Order createOrder(
            String sessionId,
            boolean isAnonymous,
            Long customerId,
            double total) {

        List<CartItem> cartItems =
                cartService.getCart(sessionId, isAnonymous);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty!");
        }

        // Reserve inventory
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {

            // Lock product row
            Product product = productRepository
                    .findByIdWithLock(cartItem.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Product not found!"));

            // Check stock
            if (product.getStockQuantity()
                    < cartItem.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for: "
                                + product.getTitle());
            }

            // Deduct stock
            product.setStockQuantity(
                    product.getStockQuantity()
                            - cartItem.getQuantity());
            productRepository.save(product);

            // Create order item
            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(cartItem.getQuantity());
            item.setUnitPrice(new Money(
                    BigDecimal.valueOf(cartItem.getPrice()),
                    cartItem.getCurrency()));
            orderItems.add(item);
        }

        // Get customer
        Customer customer = customerRepository
                .findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found!"));

        // Create order
        Order order = new Order();
        order.setStatus(OrderStatus.PENDING);
        order.setCustomer(customer);
        order.setTotalAmount(new Money(
                BigDecimal.valueOf(total), "INR"));
        order.setItems(orderItems);
        orderItems.forEach(item ->
                item.setOrder(order));

        Order saved = orderRepository.save(order);
        log.info("Order created: {}", saved.getId());

        // Clear cart
        cartService.clearCart(sessionId, isAnonymous);

        return saved;
    }
}