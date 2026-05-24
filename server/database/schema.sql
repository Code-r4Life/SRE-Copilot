CREATE TABLE IF NOT EXISTS monitored_apis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    endpoint TEXT,
    method VARCHAR(20),
    interval_seconds INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS request_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    api_id INT,
    status_code VARCHAR(50),
    latency_ms FLOAT,
    success BOOLEAN,
    error_message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS anomalies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    api_id INT,
    anomaly_type VARCHAR(255),
    severity VARCHAR(50),
    message TEXT,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    api_id INT,
    title VARCHAR(255),
    summary TEXT,
    severity VARCHAR(50),
    occurrence_count INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);