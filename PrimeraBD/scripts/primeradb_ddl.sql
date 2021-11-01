DROP SCHEMA primeradb;
CREATE SCHEMA primeradb;

USE primeradb;

CREATE USER coderhouse@localhost IDENTIFIED BY 'coderhouse';

GRANT ALL PRIVILEGES ON primeradb.* TO coderhouse@localhost identified by 'coderhouse';

FLUSH PRIVILEGES;
