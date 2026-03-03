package com.flightplanner.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;

/**
 * Logs database connection information at application startup.
 */
@Component
public class DatabaseInfoLogger implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseInfoLogger.class);

    private final DataSource dataSource;

    public DatabaseInfoLogger(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            
            String databaseProduct = metaData.getDatabaseProductName();
            String databaseVersion = metaData.getDatabaseProductVersion();
            String url = metaData.getURL();
            String username = metaData.getUserName();

            logger.info("=================================================");
            logger.info("DATABASE CONNECTION INFO");
            logger.info("=================================================");
            logger.info("Database: {} {}", databaseProduct, databaseVersion);
            logger.info("URL: {}", url);
            logger.info("User: {}", username);
            logger.info("=================================================");
        }
    }
}
