CREATE TABLE ers.user_roles(
	user_role_id INTEGER PRIMARY KEY,
	user_role VARCHAR(15)
);

CREATE TABLE ers.users(
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE,
	password VARCHAR(50) NOT NULL,
	first_name VARCHAR(100),
	last_name VARCHAR(100),
	email VARCHAR(150),
	user_role_id INTEGER REFERENCES ers.user_roles(user_role_id)
);

CREATE TABLE ers.reimbursement_type(
	reimbursement_type_id INTEGER PRIMARY KEY,
	reimbursement_type VARCHAR(10)
);

CREATE TABLE ers.reimbursement_status(
	reimbursement_status_id INTEGER PRIMARY KEY,
	reimbursement_status VARCHAR(10)
);

CREATE TABLE ers.reimbursements(
	reimbursement_id SERIAL PRIMARY KEY,
	reimbursement_amount NUMERIC NOT NULL,
	reimbursement_submitted VARCHAR,
	reimbursement_resolved VARCHAR,
	reimbursement_description TEXT,
	reimbursement_receipt VARCHAR,
	reimbursement_author INTEGER REFERENCES ers.users(user_id),
	reimbursement_resolver INTEGER REFERENCES ers.users(user_id),
	reimbursement_status_id INTEGER REFERENCES ers.reimbursement_status(reimbursement_status_id),
	reimbursement_type_id INTEGER REFERENCES ers.reimbursement_type(reimbursement_type_id)
);

CREATE TABLE ers.admin_code(
	admin_code VARCHAR(50) NOT NULL
);

INSERT INTO ers.admin_code(admin_code)
VALUES(123456789);

INSERT INTO ers.reimbursement_status(reimbursement_status_id, reimbursement_status)
VALUES(1, 'Pending');

INSERT INTO ers.reimbursement_status(reimbursement_status_id, reimbursement_status)
VALUES(2, 'Approved');

INSERT INTO ers.reimbursement_status(reimbursement_status_id, reimbursement_status)
VALUES(3, 'Denied');

INSERT INTO ers.reimbursement_type(reimbursement_type_id, reimbursement_type)
VALUES(1, 'Lodging');

INSERT INTO ers.reimbursement_type(reimbursement_type_id, reimbursement_type)
VALUES(2, 'Travel');

INSERT INTO ers.reimbursement_type(reimbursement_type_id, reimbursement_type)
VALUES(3, 'Food');

INSERT INTO ers.reimbursement_type(reimbursement_type_id, reimbursement_type)
VALUES(4, 'Other');

INSERT INTO ers.user_roles(user_role_id, user_role)
VALUES(1, 'Employee');

INSERT INTO ers.user_roles(user_role_id, user_role)
VALUES(2, 'Finance Manager');