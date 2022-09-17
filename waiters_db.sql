CREATE TABLE IF NOT EXISTS users (
    id serial primary key, 
    name VARCHAR(255) not null
    );

CREATE TABLE IF NOT EXISTS days(
   id serial primary key,
   day VARCHAR(255) NOT NULL,
   booked_day_id INT
   
);

-- INSERT INTO days(day) VALUES ('Monday'),('Tuesday'),('Wednesday'),('Thursday'),('Friday');
-- INSERT INTO users(name, booked_day_id) VALUES ('Nomzamo', '1')



-- ALTER TABLE users
-- ADD COLUMN booked_day_id INT, 
-- ADD FOREIGN KEY(booked_day_id) REFERENCES days(id);

--ALTER TABLE days DROP COLUMN booked_day_id;


