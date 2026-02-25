package com.jyotish;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class JyotishAuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(JyotishAuthApplication.class, args);
        System.out.println("""
            ╔══════════════════════════════════════════════╗
            ║   🔮 Jyotish Auth Service — Running          ║
            ║   Swagger UI: http://localhost:8080/swagger  ║
            ╚══════════════════════════════════════════════╝
            """);
    }
}
