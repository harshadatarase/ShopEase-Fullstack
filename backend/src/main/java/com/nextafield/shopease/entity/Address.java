package com.nextafield.shopease.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    private String street;
    private String city;
    private String state;
    private String pincode;
    private String country;
}