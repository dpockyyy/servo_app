CREATE DATABASE servos;

CREATE TABLE servo_info (
    id SERIAL PRIMARY KEY,
    objectId INTEGER,
    featureType TEXT NOT NULL,
    description TEXT NOT NULL,
    class TEXT NOT NULL,
    fid TEXT,
    name TEXT NOT NULL,
    operational_status TEXT NOT NULL,
    owner TEXT NOT NULL,
    industryId TEXT,
    address TEXT NOT NULL,
    suburb TEXT NOT NULL,
    state TEXT NOT NULL,
    spatial_confidence TEXT,
    revised TEXT,
    comment TEXT,
    latitude DECIMAL(15, 12),
    longitude DECIMAL(15, 12)
);


