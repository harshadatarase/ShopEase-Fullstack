package com.nextafield.shopease.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation
        .CreatedDate;
import org.springframework.data.jpa.domain.support
        .AuditingEntityListener;
import java.time.LocalDateTime;

@Entity
@Table(name = "stripe_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class StripeEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String stripeEventId;

    private String eventType;

    @Column(columnDefinition = "TEXT")
    private String payload;

    private String status;

    @CreatedDate
    private LocalDateTime createdAt;
}