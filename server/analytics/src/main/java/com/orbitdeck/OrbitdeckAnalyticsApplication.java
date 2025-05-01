package com.orbitdeck;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.orbitdeck.model")
@EnableJpaRepositories("com.orbitdeck.repository")
public class OrbitdeckAnalyticsApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrbitdeckAnalyticsApplication.class, args);
    }
}
