-- Users table for Backend 1
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);

-- Favorite Quotes table for Backend 1
CREATE TABLE IF NOT EXISTS favorite_quotes (
    id SERIAL PRIMARY KEY,
    quote_id INTEGER NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Quotes table for Backend 2
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    text VARCHAR(500) NOT NULL,
    author VARCHAR(100)
);

-- Optionally, insert initial data
INSERT INTO quotes (text, author) VALUES
('The only limit to our realization of tomorrow is our doubts of today.', 'Franklin D. Roosevelt'),
('In the end, we will remember not the words of our enemies, but the silence of our friends.', 'Martin Luther King Jr.'),
('Success is not final, failure is not fatal: It is the courage to continue that counts.', 'Winston Churchill');
