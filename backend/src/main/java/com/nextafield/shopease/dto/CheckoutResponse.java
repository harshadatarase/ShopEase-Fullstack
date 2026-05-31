package com.nextafield.shopease.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {

    private List<CartItem> items;
    private double subtotal;
    private double discount;
    private double tax;
    private double total;
    private String couponMessage;
}