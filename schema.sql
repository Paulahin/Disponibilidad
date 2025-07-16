CREATE DATABASE IF NOT EXISTS disponibilidad;

USE disponibilidad;

CREATE TABLE Site (
    id VARCHAR(100) PRIMARY KEY,
    país VARCHAR(100),
    subsidiaria VARCHAR(100)
);

CREATE TABLE AreaTrabajo (
    id VARCHAR(100) PRIMARY KEY,
    subsidiaria VARCHAR(100),
    site_id VARCHAR(100),
    FOREIGN KEY (site_id) REFERENCES Site(id)
);

ALTER TABLE AreaTrabajo ADD COLUMN pais_id INT, ADD FOREIGN KEY (pais_id) REFERENCES Pais(id);

-- Ejemplo de inserción para otros países (solo subsidiaria)
INSERT INTO AreaTrabajo (id, subsidiaria, site_id, pais_id)
VALUES ('AREA_CO_1', 'Subsidiaria A', 'SITE_CO_1', 1); -- 1 = Colombia

-- Ejemplo de inserción para México (subsidiaria y site)
INSERT INTO AreaTrabajo (id, subsidiaria, site_id, pais_id)
VALUES 
  ('AREA_MX_1', 'Subsidiaria MX1', 'SITE_MX_1', 2), -- 2 = México
  ('AREA_MX_2', 'Subsidiaria MX1', 'SITE_MX_2', 2),
  ('AREA_MX_3', 'Subsidiaria MX2', 'SITE_MX_3', 2);
  

CREATE TABLE Subsidiaria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Pais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);
CREATE TABLE Analista (
    id INT PRIMARY KEY,
    contactos INT,
    subsidiaria_id INT,
    pais_id INT,
    site_id VARCHAR(100),
    area_id VARCHAR(100),
    FOREIGN KEY (subsidiaria_id) REFERENCES Subsidiaria(id),
    FOREIGN KEY (pais_id) REFERENCES Pais(id),
    FOREIGN KEY (site_id) REFERENCES Site(id),
    FOREIGN KEY (area_id) REFERENCES AreaTrabajo(id)
);

CREATE TABLE Disponibilidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    analista_id INT NOT NULL,
    fecha DATE NOT NULL,
    disponible BOOLEAN DEFAULT 1,
    FOREIGN KEY (analista_id) REFERENCES Analista(id),
    UNIQUE KEY unique_analista_fecha (analista_id, fecha)
);

