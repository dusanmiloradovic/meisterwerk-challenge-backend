CREATE TABLE "addresses" (
	"address_id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"address"	TEXT
);
CREATE TABLE "events" (
	"title"	TEXT,
	"start_time"	TEXT,--sqlite doesn't have the built in date type, but supports ranges with it's data functions
	"end_time"	TEXT,
	"address_id"	INTEGER,
	"status"	TEXT,
	"events_id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	foreign key (address_id) REFERENCES addresses
);
