CREATE TABLE IF NOT EXISTS users (
    id identity primary key, 
    name VARCHAR(255) not null,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL
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
-- CREATE TABLE IF NOT EXISTS admin_table(
--     id serial primary key, 
--     booked_day_id INT,
--     FOREIGN KEY(booked_day_id) REFERENCES days(id),
--     name_id INT,
--     FOREIGN KEY(name_id) REFERENCES users(id)
-- );


INSERT INTO days(day) VALUES ('Monday'),('Tuesday'),('Wednesday'),('Thursda'),('Friday'),('Saturday'),('Sunday');
-- INSERT INTO users(name, booked_day_id) VALUES ('Nomzamo', '1')

-- SELECT name_id, booked_day_id, count(*) FROM booked_days GROUP BY name_id, booked_day_id
-- HAVING count(*) > 1;

-- SELECT STRING_AGG(users.name, ',') from booked_days AS bd Inner join users on users.id = bd.name_id Inner join days on days.id = bd.booked_day_id where days.id = 1;

-- ALTER TABLE users ADD COLUMN email varchar(255) NOT NULL, Add column code varchar(255) NOT NULL; 

-- ALTER TABLE users ALTER COLUMN code varchar(255); 

-- ADD FOREIGN KEY(booked_day_id) REFERENCES days(id);

-- ALTER TABLE users DROP COLUMN booked_day_id;


