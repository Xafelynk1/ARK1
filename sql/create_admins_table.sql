CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    confirm_password VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    safeword VARCHAR(255) NOT NULL
);
