package com.nextafield.shopease;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ShopeaseApplication {
    public static void main(String[] args) {
        SpringApplication.run(
                ShopeaseApplication.class, args);
    }
}