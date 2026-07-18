package com.creatorhub.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseMigrationRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        try {
            log.info("Running custom database migrations...");
            
            // Convert ENUM columns to VARCHAR to prevent Data Truncation errors when new Enum values are added in Java
            jdbcTemplate.execute("ALTER TABLE notifications MODIFY type VARCHAR(50) NOT NULL");
            log.info("Successfully altered notifications.type column to VARCHAR(50)");
            
            jdbcTemplate.execute("ALTER TABLE collaboration_projects MODIFY status VARCHAR(50) NOT NULL");
            log.info("Successfully altered collaboration_projects.status column to VARCHAR(50)");
            
        } catch (Exception e) {
            log.warn("Database migration skipped (might already be applied or table doesn't exist): {}", e.getMessage());
        }
    }
}
