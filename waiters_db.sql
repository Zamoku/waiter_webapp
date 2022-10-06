CREATE TABLE IF NOT EXISTS users (
    id serial primary key, 
    name VARCHAR(255) not null
    );

CREATE TABLE IF NOT EXISTS days(
   id serial primary key,
   day VARCHAR(255) NOT NULL  
);
CREATE TABLE IF NOT EXISTS booked_days(
    id serial primary key, 
    name_id INT,
    FOREIGN KEY(name_id) REFERENCES users(id),
    booked_day_id INT,
    FOREIGN KEY(booked_day_id) REFERENCES days(id)
);

-- INSERT INTO days(day) VALUES ('Monday'),('Tuesday'),('Wednesday'),('Thursday'),('Friday');
-- INSERT INTO users(name, booked_day_id) VALUES ('Nomzamo', '1')

-- ALTER TABLE users
-- ADD COLUMN booked_day_id INT, 

-- ADD FOREIGN KEY(booked_day_id) REFERENCES days(id);

ALTER TABLE users DROP COLUMN booked_day_id;


