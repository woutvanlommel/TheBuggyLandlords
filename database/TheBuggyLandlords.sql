-- -------------------------------------------------------------
-- TablePlus 6.8.0(654)
--
-- https://tableplus.com/
--
-- Database: ID324796_TEAM4
-- Generation Time: 2026-01-06 15:01:41.2470
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `account` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `credits` bigint(20) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;

CREATE TABLE `building` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `street_id` bigint(20) NOT NULL,
  `housenumber` varchar(255) NOT NULL,
  `place_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;

CREATE TABLE `complaint` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `complaint_type_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;

CREATE TABLE `complaint_document` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `complaint_id` bigint(20) NOT NULL,
  `document_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

CREATE TABLE `complainttype` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

CREATE TABLE `condition` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

CREATE TABLE `condition_document` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `condition_id` bigint(20) NOT NULL,
  `document_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `document` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `document_type_id` bigint(20) NOT NULL,
  `account_id` bigint(20) NOT NULL,
  `timestamp` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;

CREATE TABLE `documenttype` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

CREATE TABLE `facility` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `facility` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

CREATE TABLE `facility_room` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `facility_id` bigint(20) NOT NULL,
  `room_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

CREATE TABLE `place` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `place` varchar(255) NOT NULL,
  `zipcode` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;

CREATE TABLE `role` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

CREATE TABLE `room` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `roomnumber` varchar(255) NOT NULL,
  `price` bigint(20) NOT NULL,
  `building_id` bigint(20) NOT NULL,
  `account_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;

CREATE TABLE `street` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `street` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;

INSERT INTO `account` (`id`, `name`, `fname`, `password`, `phone`, `mail`, `credits`, `role_id`) VALUES
(1, 'Peeters', 'Lotte', '$2y$10$dummyhash', '0470123456', 'lotte.peeters@student.be', 100, 1),
(2, 'Janssens', 'Robbe', '$2y$10$dummyhash', '0470123457', 'robbe.janssens@student.be', 200, 1),
(3, 'Maes', 'Noah', '$2y$10$dummyhash', '0470123458', 'noah.maes@student.be', 150, 1),
(4, 'Jacobs', 'Emma', '$2y$10$dummyhash', '0470123459', 'emma.jacobs@student.be', 80, 1),
(5, 'Mertens', 'Arthur', '$2y$10$dummyhash', '0470123460', 'arthur.mertens@student.be', 120, 1),
(6, 'Willems', 'Mila', '$2y$10$dummyhash', '0470123461', 'mila.willems@student.be', 90, 1),
(7, 'Claes', 'Liam', '$2y$10$dummyhash', '0470123462', 'liam.claes@student.be', 110, 1),
(8, 'Goossens', 'Olivia', '$2y$10$dummyhash', '0470123463', 'olivia.goossens@student.be', 75, 1),
(9, 'Wouters', 'Louis', '$2y$10$dummyhash', '0470123464', 'louis.wouters@student.be', 60, 1),
(10, 'De Smet', 'Louise', '$2y$10$dummyhash', '0470123465', 'louise.desmet@student.be', 95, 1),
(11, 'Vermeulen', 'Lucas', '$2y$10$dummyhash', '0470123466', 'lucas.vermeulen@student.be', 130, 1),
(12, 'Pauwels', 'Elise', '$2y$10$dummyhash', '0470123467', 'elise.pauwels@student.be', 85, 1),
(13, 'Dubois', 'Adam', '$2y$10$dummyhash', '0470123468', 'adam.dubois@student.be', 140, 1),
(14, 'Hermans', 'Marie', '$2y$10$dummyhash', '0470123469', 'marie.hermans@student.be', 70, 1),
(15, 'Michiels', 'Jules', '$2y$10$dummyhash', '0470123470', 'jules.michiels@student.be', 160, 1),
(16, 'Martens', 'Ella', '$2y$10$dummyhash', '0470123471', 'ella.martens@student.be', 105, 1),
(17, 'Vandenberghe', 'Victor', '$2y$10$dummyhash', '0470123472', 'victor.vandenberghe@student.be', 115, 1),
(18, 'Desmet', 'Julie', '$2y$10$dummyhash', '0470123473', 'julie.desmet@student.be', 125, 1),
(19, 'De Backer', 'Gabriel', '$2y$10$dummyhash', '0470123474', 'gabriel.debacker@student.be', 135, 1),
(20, 'Lemmens', 'Sarah', '$2y$10$dummyhash', '0470123475', 'sarah.lemmens@student.be', 145, 1),
(21, 'Verstraete', 'Mohamed', '$2y$10$dummyhash', '0470123476', 'mohamed.verstraete@student.be', 155, 1),
(22, 'D\'hondt', 'Yasmine', '$2y$10$dummyhash', '0470123477', 'yasmine.dhondt@student.be', 165, 1),
(23, 'Van Damme', 'Thomas', '$2y$10$dummyhash', '0470123478', 'thomas.vandamme@student.be', 175, 1),
(24, 'Segers', 'Amber', '$2y$10$dummyhash', '0470123479', 'amber.segers@student.be', 185, 1),
(25, 'Cornelis', 'Nathan', '$2y$10$dummyhash', '0470123480', 'nathan.cornelis@student.be', 195, 1),
(26, 'Declercq', 'Fien', '$2y$10$dummyhash', '0470123481', 'fien.declercq@student.be', 205, 1),
(27, 'Brouwers', 'Seppe', '$2y$10$dummyhash', '0470123482', 'seppe.brouwers@student.be', 215, 1),
(28, 'De Clercq', 'Noor', '$2y$10$dummyhash', '0470123483', 'noor.declercq@student.be', 225, 1),
(29, 'Thys', 'Mats', '$2y$10$dummyhash', '0470123484', 'mats.thys@student.be', 235, 1),
(30, 'Govaerts', 'Lena', '$2y$10$dummyhash', '0470123485', 'lena.govaerts@student.be', 245, 1),
(31, 'Peeters', 'Kobe', '$2y$10$dummyhash', '0480112233', 'kobe.peeters@immo.be', 255, 2),
(32, 'Janssens', 'Anna', '$2y$10$dummyhash', '0480112234', 'anna.janssens@kotbaas.be', 265, 2),
(33, 'Maes', 'Alexander', '$2y$10$dummyhash', '0480112235', 'alexander.maes@rent.be', 275, 2),
(34, 'Jacobs', 'Elena', '$2y$10$dummyhash', '0480112236', 'elena.jacobs@invest.be', 285, 2),
(35, 'Mertens', 'Mathis', '$2y$10$dummyhash', '0480112237', 'mathis.mertens@landlord.be', 295, 2),
(36, 'Willems', 'Hanne', '$2y$10$dummyhash', '0480112238', 'hanne.willems@studios.be', 305, 2),
(37, 'Claes', 'Elias', '$2y$10$dummyhash', '0480112239', 'elias.claes@koten.be', 315, 2),
(38, 'Goossens', 'Oona', '$2y$10$dummyhash', '0480112240', 'oona.goossens@kamers.be', 325, 2),
(39, 'Wouters', 'Arne', '$2y$10$dummyhash', '0490998877', 'admin.arne@app.be', 335, 3),
(40, 'De Smet', 'Charlotte', '$2y$10$dummyhash', '0490998878', 'admin.charlotte@app.be', 345, 3);

INSERT INTO `building` (`id`, `street_id`, `housenumber`, `place_id`) VALUES
(1, 1, '12', 1),
(2, 2, '5A', 1),
(3, 6, '110', 4),
(4, 7, '23', 4),
(5, 11, '4B', 7),
(6, 16, '88', 10),
(7, 1, '14bis', 1),
(8, 6, '9', 4),
(9, 3, '45', 1),
(10, 4, '101', 1),
(11, 5, '2', 1),
(12, 8, '33', 4),
(13, 9, '12A', 4),
(14, 10, '7', 4),
(15, 12, '55', 7),
(16, 13, '89', 7),
(17, 14, '21', 7),
(18, 15, '6', 7),
(19, 17, '10', 10),
(20, 18, '44', 10),
(21, 19, '1', 10),
(22, 20, '100', 12),
(23, 21, '32', 15),
(24, 22, '14', 5),
(25, 23, '99', 16),
(26, 24, '12', 17),
(27, 25, '77', 22),
(28, 26, '3', 24),
(29, 27, '5B', 25),
(30, 28, '8', 26);

INSERT INTO `complaint` (`id`, `name`, `description`, `complaint_type_id`) VALUES
(1, 'Lekkende kraan', 'Keukenkraan lekt constant.', 1),
(2, 'Geen warm water', 'Boiler geeft storing.', 1),
(3, 'Luidruchtige buren', 'Muziek na 22u.', 2),
(4, 'Wifi traag', 'Kan niet streamen op 2e verdiep.', 3),
(5, 'Vuilzakken gang', 'Buren laten vuilzakken staan.', 5),
(6, 'Deurbel stuk', 'Ik hoor niet als er iemand belt.', 1),
(7, 'Raam sluit niet', 'Raam straatkant klemt.', 1),
(8, 'Schimmel badkamer', 'Zwarte plekken op plafond.', 5),
(9, 'Internet valt uit', 'Modem herstart spontaan.', 3),
(10, 'Verwarming', 'Radiator lekt water.', 1),
(11, 'Muis gezien', 'In de keuken.', 5),
(12, 'Sleutel kwijt', 'Kan ik een reserve krijgen?', 4),
(13, 'Huurcontract vraag', 'Wanneer loopt het af?', 4),
(14, 'Lamp gang stuk', 'Het is donker op de trap.', 1),
(15, 'Lift defect', 'Staat vast op 2e.', 1),
(16, 'Geluid straat', 'Slecht geïsoleerd raam.', 2),
(17, 'Geurhinder', 'Rioolgeur in badkamer.', 5),
(18, 'Kookplaat barst', 'Barst in keramische plaat.', 1),
(19, 'Douchekop stuk', 'Water spuit alle kanten op.', 1),
(20, 'Toilet loopt door', 'Water blijft lopen.', 1),
(21, 'Rookmelder piept', 'Batterij leeg?', 1),
(22, 'Vochtplek muur', 'Naast het raam.', 1),
(23, 'Geen internet', 'Al 2 uur offline.', 3),
(24, 'Feestje buren', 'Te luid.', 2),
(25, 'Postbus kapot', 'Slotje werkt niet.', 1),
(26, 'Tegel los', 'Vloertegel badkamer.', 1),
(27, 'Stopcontact los', 'Gevaarlijk.', 1),
(28, 'Gordijnrail los', 'Naar beneden gekomen.', 1),
(29, 'Vaatwasser stuk', 'Pomp werkt niet.', 1),
(30, 'Afvoer verstopt', 'Douche loopt niet weg.', 1);

INSERT INTO `complaint_document` (`id`, `complaint_id`, `document_id`) VALUES
(1, 1, 1),
(2, 5, 2),
(3, 8, 5);

INSERT INTO `complainttype` (`id`, `type`) VALUES
(1, 'Technisch defect'),
(2, 'Geluidsoverlast'),
(3, 'Internet'),
(4, 'Administratie'),
(5, 'Hygiëne');

INSERT INTO `condition` (`id`, `name`, `description`) VALUES
(1, 'Kamer Yentl', 'Alles is inorde, geen enkele vorm van schade.'),
(2, 'Kamer Alessio', 'Wc bril hangt scheef, moet gefikst worden voor dat Alessio eruit gaat.'),
(3, 'Kamer Wout', 'Isolatie van de raamwanden is eruit.');

INSERT INTO `document` (`id`, `name`, `document_type_id`, `account_id`, `timestamp`) VALUES
(1, 'Contract_Lotte.pdf', 1, 1, '2026-01-06 14:02:44'),
(2, 'PB_Lotte.pdf', 2, 1, '2026-01-06 14:02:44'),
(3, 'Contract_Robbe.pdf', 1, 2, '2026-01-06 14:02:44'),
(4, 'Contract_Noah.pdf', 1, 3, '2026-01-06 14:02:44'),
(5, 'Reglement_Gebouw1.pdf', 3, 31, '2026-01-06 14:02:44'),
(6, 'Verzekering_Gebouw1.pdf', 4, 31, '2026-01-06 14:02:44'),
(7, 'Contract_Emma.pdf', 1, 4, '2026-01-06 14:02:44'),
(8, 'Contract_Arthur.pdf', 1, 5, '2026-01-06 14:02:44'),
(9, 'PB_Arthur.pdf', 2, 5, '2026-01-06 14:02:44'),
(10, 'Contract_Mila.pdf', 1, 6, '2026-01-06 14:02:44'),
(11, 'EPC_Gebouw2.pdf', 5, 31, '2026-01-06 14:02:44'),
(12, 'Contract_Liam.pdf', 1, 7, '2026-01-06 14:02:44'),
(13, 'Contract_Olivia.pdf', 1, 8, '2026-01-06 14:02:44'),
(14, 'Contract_Louis.pdf', 1, 9, '2026-01-06 14:02:44'),
(15, 'Contract_Louise.pdf', 1, 10, '2026-01-06 14:02:44'),
(16, 'PB_Louise.pdf', 2, 10, '2026-01-06 14:02:44'),
(17, 'Contract_Lucas.pdf', 1, 11, '2026-01-06 14:02:44'),
(18, 'Contract_Elise.pdf', 1, 12, '2026-01-06 14:02:44'),
(19, 'Contract_Adam.pdf', 1, 13, '2026-01-06 14:02:44'),
(20, 'Contract_Marie.pdf', 1, 14, '2026-01-06 14:02:44'),
(21, 'Contract_Jules.pdf', 1, 15, '2026-01-06 14:02:44'),
(22, 'Contract_Ella.pdf', 1, 16, '2026-01-06 14:02:44'),
(23, 'Contract_Victor.pdf', 1, 17, '2026-01-06 14:02:44'),
(24, 'Contract_Julie.pdf', 1, 18, '2026-01-06 14:02:44'),
(25, 'Contract_Gabriel.pdf', 1, 19, '2026-01-06 14:02:44'),
(26, 'Contract_Sarah.pdf', 1, 20, '2026-01-06 14:02:44'),
(27, 'Contract_Mohamed.pdf', 1, 21, '2026-01-06 14:02:44'),
(28, 'Contract_Yasmine.pdf', 1, 22, '2026-01-06 14:02:44'),
(29, 'Contract_Thomas.pdf', 1, 23, '2026-01-06 14:02:44'),
(30, 'Contract_Amber.pdf', 1, 24, '2026-01-06 14:02:44');

INSERT INTO `documenttype` (`id`, `type`) VALUES
(1, 'Huurcontract'),
(2, 'Plaatsbeschrijving'),
(3, 'Huishoudelijk Reglement'),
(4, 'Brandverzekering'),
(5, 'EPC Attest'),
(6, 'Klacht');

INSERT INTO `facility` (`id`, `facility`) VALUES
(1, 'Snel Internet'),
(2, 'Eigen badkamer'),
(3, 'Gemeenschappelijke keuken'),
(4, 'Eigen keuken'),
(5, 'Fietsenstalling'),
(6, 'Bemeubeld'),
(7, 'Tuin/Koer'),
(8, 'Wasmachine aanwezig'),
(9, 'Dichtbij station'),
(10, 'Huisdieren toegelaten');

INSERT INTO `facility_room` (`id`, `facility_id`, `room_id`) VALUES
(1, 1, 1),
(2, 6, 1),
(3, 3, 1),
(4, 1, 2),
(5, 6, 2),
(6, 3, 2),
(7, 1, 3),
(8, 6, 3),
(9, 3, 3),
(10, 1, 5),
(11, 2, 5),
(12, 4, 5),
(13, 1, 13),
(14, 2, 13),
(15, 4, 13),
(16, 5, 13),
(17, 1, 15),
(18, 3, 15),
(19, 5, 15),
(20, 1, 23),
(21, 2, 23),
(22, 4, 23),
(23, 7, 23),
(24, 8, 23),
(25, 1, 30),
(26, 2, 30),
(27, 4, 30),
(28, 6, 30),
(29, 9, 30);

INSERT INTO `place` (`id`, `place`, `zipcode`) VALUES
(1, 'Leuven', 3000),
(2, 'Heverlee', 3001),
(3, 'Kessel-Lo', 3010),
(4, 'Gent', 9000),
(5, 'Mariakerke', 9030),
(6, 'Ledeberg', 9050),
(7, 'Antwerpen', 2000),
(8, 'Berchem', 2600),
(9, 'Wilrijk', 2610),
(10, 'Hasselt', 3500),
(11, 'Diepenbeek', 3590),
(12, 'Brussel', 1000),
(13, 'Elsene', 1050),
(14, 'Etterbeek', 1040),
(15, 'Mechelen', 2800),
(16, 'Brugge', 8000),
(17, 'Kortrijk', 8500),
(18, 'Maastricht', 6211),
(19, 'Lille', 59000),
(20, 'Aachen', 52062),
(21, 'Oostende', 8400),
(22, 'Genk', 3600),
(23, 'Roeselare', 8800),
(24, 'Aalst', 9300),
(25, 'Sint-Niklaas', 9100),
(26, 'Turnhout', 2300),
(27, 'Luik', 4000),
(28, 'Namen', 5000),
(29, 'Bergen', 7000),
(30, 'Charleroi', 6000);

INSERT INTO `role` (`id`, `role`) VALUES
(1, 'Huurder'),
(2, 'Verhuurder'),
(3, 'Admin');

INSERT INTO `room` (`id`, `roomnumber`, `price`, `building_id`, `account_id`) VALUES
(1, '0.01', 450, 1, 1),
(2, '1.01', 480, 1, 2),
(3, '1.02', 460, 1, 3),
(4, '2.01', 500, 1, 4),
(5, 'A', 600, 2, 5),
(6, 'B', 550, 2, 6),
(7, '10', 400, 3, 7),
(8, '11', 410, 3, 8),
(9, '12', 390, 3, 9),
(10, 'Glv', 520, 4, 10),
(11, '1L', 480, 4, 11),
(12, '1R', 480, 4, 12),
(13, 'Studio 1', 650, 5, 13),
(14, 'Studio 2', 670, 5, 14),
(15, 'K1', 350, 6, 15),
(16, 'K2', 360, 6, 16),
(17, 'K3', 350, 6, 17),
(18, 'K4', 370, 6, 18),
(19, '3.01', 510, 7, 19),
(20, '3.02', 510, 7, 20),
(21, '01', 440, 8, 21),
(22, '02', 440, 8, 22),
(23, 'Penthouse', 800, 9, 23),
(24, 'A1', 490, 10, 24),
(25, 'A2', 495, 10, 25),
(26, 'B1', 505, 10, 26),
(27, '1.1', 425, 11, 27),
(28, '1.2', 425, 11, 28),
(29, 'Gelijkvloers', 580, 12, 29),
(30, 'Dakapp', 700, 13, 30);

INSERT INTO `street` (`id`, `street`) VALUES
(1, 'Naamsestraat'),
(2, 'Oude Markt'),
(3, 'Bondgenotenlaan'),
(4, 'Tiensestraat'),
(5, 'Andreas Vesaliusstraat'),
(6, 'Overpoortstraat'),
(7, 'Sint-Pietersnieuwstraat'),
(8, 'Korianderstraat'),
(9, 'Bagattenstraat'),
(10, 'Rozier'),
(11, 'Ossenmarkt'),
(12, 'Paardenmarkt'),
(13, 'Italiëlei'),
(14, 'Prinsstraat'),
(15, 'Rodestraat'),
(16, 'Kempische Steenweg'),
(17, 'Elfde-Liniestraat'),
(18, 'Martelarenlaan'),
(19, 'Grote Markt'),
(20, 'Nieuwstraat'),
(21, 'Koningin Astridlaan'),
(22, 'Veldstraat'),
(23, 'Hoogstraat'),
(24, 'Kerkstraat'),
(25, 'Stationsstraat'),
(26, 'Dorpsstraat'),
(27, 'Molenstraat'),
(28, 'Kloosterstraat'),
(29, 'Lange Leemstraat'),
(30, 'Zuidstraat');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;