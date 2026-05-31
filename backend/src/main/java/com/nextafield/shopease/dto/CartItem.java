package com.nextafield.shopease.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    private Long productId;
    private String title;
    private String brand;
    private Double price;
    private String currency;
    private Integer quantity;
}