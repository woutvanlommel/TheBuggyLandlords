<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class ImportDataSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        $sql = <<<'SQL'
            -- 1. Eerst de rollen
            INSERT INTO `role` (`id`, `role`) VALUES (1, 'Huurder'), (2, 'Verhuurder'), (3, 'Admin');

            -- 2. Straten en Plaatsen
            INSERT INTO `street` (`id`, `street`) VALUES
            (1, 'Naamsestraat'), (2, 'Oude Markt'), (3, 'Bondgenotenlaan'), (4, 'Tiensestraat'), (5, 'Andreas Vesaliusstraat'),
            (6, 'Overpoortstraat'), (7, 'Sint-Pietersnieuwstraat'), (8, 'Korianderstraat'), (9, 'Bagattenstraat'), (10, 'Rozier'),
            (11, 'Ossenmarkt'), (12, 'Paardenmarkt'), (13, 'Italiëlei'), (14, 'Prinsstraat'), (15, 'Rodestraat'),
            (16, 'Kempische Steenweg'), (17, 'Elfde-Liniestraat'), (18, 'Martelarenlaan'), (19, 'Grote Markt'), (20, 'Nieuwstraat'),
            (21, 'Koningin Astridlaan'), (22, 'Veldstraat'), (23, 'Hoogstraat'), (24, 'Kerkstraat'), (25, 'Stationsstraat'),
            (26, 'Dorpsstraat'), (27, 'Molenstraat'), (28, 'Kloosterstraat'), (29, 'Lange Leemstraat'), (30, 'Zuidstraat');

            INSERT INTO `place` (`id`, `place`, `zipcode`) VALUES
            (1, 'Leuven', 3000), (2, 'Heverlee', 3001), (3, 'Kessel-Lo', 3010), (4, 'Gent', 9000), (5, 'Mariakerke', 9030),
            (6, 'Ledeberg', 9050), (7, 'Antwerpen', 2000), (8, 'Berchem', 2600), (9, 'Wilrijk', 2610), (10, 'Hasselt', 3500),
            (11, 'Diepenbeek', 3590), (12, 'Brussel', 1000), (13, 'Elsene', 1050), (14, 'Etterbeek', 1040), (15, 'Mechelen', 2800),
            (16, 'Brugge', 8000), (17, 'Kortrijk', 8500), (18, 'Maastricht', 6211), (19, 'Lille', 59000), (20, 'Aachen', 52062),
            (21, 'Oostende', 8400), (22, 'Genk', 3600), (23, 'Roeselare', 8800), (24, 'Aalst', 9300), (25, 'Sint-Niklaas', 9100),
            (26, 'Turnhout', 2300), (27, 'Luik', 4000), (28, 'Namen', 5000), (29, 'Bergen', 7000), (30, 'Charleroi', 6000);

            -- 3. Types en Faciliteiten
            INSERT INTO `complainttype` (`id`, `type`) VALUES (1, 'Technisch defect'), (2, 'Geluidsoverlast'), (3, 'Internet'), (4, 'Administratie'), (5, 'Hygiëne');
            INSERT INTO `documenttype` (id, `type`) VALUES (1, 'Huurcontract'), (2, 'Plaatsbeschrijving'), (3, 'Huishoudelijk Reglement'), (4, 'Brandverzekering'), (5, 'EPC Attest'), (6, 'Klacht'), (7, 'Kamerafbeelding'), (8, 'Profielfoto');
            INSERT INTO `facility` (`id`, `facility`) VALUES (1, 'Snel Internet'), (2, 'Eigen badkamer'), (3, 'Gemeenschappelijke keuken'), (4, 'Eigen keuken'), (5, 'Fietsenstalling'), (6, 'Bemeubeld'), (7, 'Tuin/Koer'), (8, 'Wasmachine aanwezig'), (9, 'Dichtbij station'), (10, 'Huisdieren toegelaten');
            INSERT INTO `condition` (`id`, `name`, `description`) VALUES (1, 'Kamer Yentl', 'Alles is inorde.'), (2, 'Kamer Alessio', 'Wc bril hangt scheef.'), (3, 'Kamer Wout', 'Isolatie raamwanden ontbreekt.');

            -- 4. USERS (Voorheen Account)
            -- Let op: tabelnaam 'users', kolom 'email' ipv 'mail', en 'role_id' wordt behouden
            -- 4. USERS (Added created_at and updated_at)
            INSERT INTO `users` (`id`, `name`, `fname`, `password`, `phone`, `email`, `credits`, `role_id`, `created_at`, `updated_at`) VALUES
            (1, 'Peeters', 'Lotte', '$2y$10$dummyhash', '0470123456', 'lotte.peeters@student.be', 100, 1, NOW(), NOW()),
            (2, 'Janssens', 'Robbe', '$2y$10$dummyhash', '0470123457', 'robbe.janssens@student.be', 200, 1, NOW(), NOW()),
            (3, 'Maes', 'Noah', '$2y$10$dummyhash', '0470123458', 'noah.maes@student.be', 150, 1, NOW(), NOW()),
            (4, 'Jacobs', 'Emma', '$2y$10$dummyhash', '0470123459', 'emma.jacobs@student.be', 80, 1, NOW(), NOW()),
            (5, 'Mertens', 'Arthur', '$2y$10$dummyhash', '0470123460', 'arthur.mertens@student.be', 120, 1, NOW(), NOW()),
            (6, 'Willems', 'Mila', '$2y$10$dummyhash', '0470123461', 'mila.willems@student.be', 90, 1, NOW(), NOW()),
            (7, 'Claes', 'Liam', '$2y$10$dummyhash', '0470123462', 'liam.claes@student.be', 110, 1, NOW(), NOW()),
            (8, 'Goossens', 'Olivia', '$2y$10$dummyhash', '0470123463', 'olivia.goossens@student.be', 75, 1, NOW(), NOW()),
            (9, 'Wouters', 'Louis', '$2y$10$dummyhash', '0470123464', 'louis.wouters@student.be', 60, 1, NOW(), NOW()),
            (10, 'De Smet', 'Louise', '$2y$10$dummyhash', '0470123465', 'louise.desmet@student.be', 95, 1, NOW(), NOW()),
            (11, 'Vermeulen', 'Lucas', '$2y$10$dummyhash', '0470123466', 'lucas.vermeulen@student.be', 130, 1, NOW(), NOW()),
            (12, 'Pauwels', 'Elise', '$2y$10$dummyhash', '0470123467', 'elise.pauwels@student.be', 85, 1, NOW(), NOW()),
            (13, 'Dubois', 'Adam', '$2y$10$dummyhash', '0470123468', 'adam.dubois@student.be', 140, 1, NOW(), NOW()),
            (14, 'Hermans', 'Marie', '$2y$10$dummyhash', '0470123469', 'marie.hermans@student.be', 70, 1, NOW(), NOW()),
            (15, 'Michiels', 'Jules', '$2y$10$dummyhash', '0470123470', 'jules.michiels@student.be', 160, 1, NOW(), NOW()),
            (16, 'Martens', 'Ella', '$2y$10$dummyhash', '0470123471', 'ella.martens@student.be', 105, 1, NOW(), NOW()),
            (17, 'Vandenberghe', 'Victor', '$2y$10$dummyhash', '0470123472', 'victor.vandenberghe@student.be', 115, 1, NOW(), NOW()),
            (18, 'Desmet', 'Julie', '$2y$10$dummyhash', '0470123473', 'julie.desmet@student.be', 125, 1, NOW(), NOW()),
            (19, 'De Backer', 'Gabriel', '$2y$10$dummyhash', '0470123474', 'gabriel.debacker@student.be', 135, 1, NOW(), NOW()),
            (20, 'Lemmens', 'Sarah', '$2y$10$dummyhash', '0470123475', 'sarah.lemmens@student.be', 145, 1, NOW(), NOW()),
            (21, 'Verstraete', 'Mohamed', '$2y$10$dummyhash', '0470123476', 'mohamed.verstraete@student.be', 155, 1, NOW(), NOW()),
            (22, 'hondt', 'Yasmine', '$2y$10$dummyhash', '0470123477', 'yasmine.dhondt@student.be', 165, 1, NOW(), NOW()),
            (23, 'Van Damme', 'Thomas', '$2y$10$dummyhash', '0470123478', 'thomas.vandamme@student.be', 175, 1, NOW(), NOW()),
            (24, 'Segers', 'Amber', '$2y$10$dummyhash', '0470123479', 'amber.segers@student.be', 185, 1, NOW(), NOW()),
            (25, 'Cornelis', 'Nathan', '$2y$10$dummyhash', '0470123480', 'nathan.cornelis@student.be', 195, 1, NOW(), NOW()),
            (26, 'Declercq', 'Fien', '$2y$10$dummyhash', '0470123481', 'fien.declercq@student.be', 205, 1, NOW(), NOW()),
            (27, 'Brouwers', 'Seppe', '$2y$10$dummyhash', '0470123482', 'seppe.brouwers@student.be', 215, 1, NOW(), NOW()),
            (28, 'De Clercq', 'Noor', '$2y$10$dummyhash', '0470123483', 'noor.declercq@student.be', 225, 1, NOW(), NOW()),
            (29, 'Thys', 'Mats', '$2y$10$dummyhash', '0470123484', 'mats.thys@student.be', 235, 1, NOW(), NOW()),
            (30, 'Govaerts', 'Lena', '$2y$10$dummyhash', '0470123485', 'lena.govaerts@student.be', 245, 1, NOW(), NOW()),
            (31, 'Peeters', 'Kobe', '$2y$10$dummyhash', '0480112233', 'kobe.peeters@immo.be', 255, 2, NOW(), NOW()),
            (32, 'Janssens', 'Anna', '$2y$10$dummyhash', '0480112234', 'anna.janssens@kotbaas.be', 265, 2, NOW(), NOW()),
            (33, 'Maes', 'Alexander', '$2y$10$dummyhash', '0480112235', 'alexander.maes@rent.be', 275, 2, NOW(), NOW()),
            (34, 'Jacobs', 'Elena', '$2y$10$dummyhash', '0480112236', 'elena.jacobs@invest.be', 285, 2, NOW(), NOW()),
            (35, 'Mertens', 'Mathis', '$2y$10$dummyhash', '0480112237', 'mathis.mertens@landlord.be', 295, 2, NOW(), NOW()),
            (36, 'Willems', 'Hanne', '$2y$10$dummyhash', '0480112238', 'hanne.willems@studios.be', 305, 2, NOW(), NOW()),
            (37, 'Claes', 'Elias', '$2y$10$dummyhash', '0480112239', 'elias.claes@koten.be', 315, 2, NOW(), NOW()),
            (38, 'Goossens', 'Oona', '$2y$10$dummyhash', '0480112240', 'oona.goossens@kamers.be', 325, 2, NOW(), NOW()),
            (39, 'Wouters', 'Arne', '$2y$10$dummyhash', '0490998877', 'admin.arne@app.be', 335, 3, NOW(), NOW()),
            (40, 'De Smet', 'Charlotte', '$2y$10$dummyhash', '0490998878', 'admin.charlotte@app.be', 345, 3, NOW(), NOW()),
            (41, 'test', 'tester', '$2y$12$Bvai5AbRmpewVj6qwCy4g.GnzS7Fbu./6IxBkQBAvyOuc0Lw2FpXO', '0412345678', 'test@test.com', 5, 3, NOW(), NOW());


            -- 5. Gebouwen (Met user_id/eigenaar)
            INSERT INTO `building` (`id`, `street_id`, `housenumber`, `place_id`, `user_id`) VALUES
            (1, 1, '12', 1, 31), (2, 2, '5A', 1, 32), (3, 6, '110', 4, 33), (4, 7, '23', 4, 34), (5, 11, '4B', 7, 35),
            (6, 16, '88', 10, 36), (7, 1, '14bis', 1, 37), (8, 6, '9', 4, 38), (9, 3, '45', 1, 31), (10, 4, '101', 1, 32),
            (11, 5, '2', 1, 33), (12, 8, '33', 4, 34), (13, 9, '12A', 4, 35), (14, 10, '7', 4, 36), (15, 12, '55', 7, 37),
            (16, 13, '89', 7, 38), (17, 14, '21', 7, 31), (18, 15, '6', 7, 32), (19, 17, '10', 10, 33), (20, 18, '44', 10, 34),
            (21, 19, '1', 10, 35), (22, 20, '100', 12, 36), (23, 21, '32', 15, 37), (24, 22, '14', 5, 38), (25, 23, '99', 16, 31),
            (26, 24, '12', 17, 32), (27, 25, '77', 22, 33), (28, 26, '3', 24, 34), (29, 27, '5B', 25, 35), (30, 28, '8', 26, 36), (31, 29, '15', 1, 37);

            -- 6. Kamers (Gebruik nu user_id ipv account_id)
            INSERT INTO `room` (`id`, `roomnumber`, `price`, `building_id`, `is_highlighted`, `roomtype_id`) VALUES
            (1, '0.01', 450, 1, 1, 1), (2, '1.01', 480, 1, 0, 2), (3, '1.02', 460, 1, 0, 2), (4, '2.01', 500, 1, 0, 2), (5, 'A', 600, 2, 1, 1),
            (6, 'B', 550, 2, 0, 2), (7, '10', 400, 3, 0, 2), (8, '11', 410, 3, 0, 2), (9, '12', 390, 3, 0, 2), (10, 'Glv', 520, 4, 1, 1),
            (11, '1L', 480, 4, 0, 2), (12, '1R', 480, 4, 0, 2), (13, 'Studio 1', 650, 5, 1, 1), (14, 'Studio 2', 670, 5, 0, 1), (15, 'K1', 350, 6, 0, 2),
            (16, 'K2', 360, 6, 0, 2), (17, 'K3', 350, 6, 0, 2), (18, 'K4', 370, 6, 0, 2), (19, '3.01', 510, 7, 0, 2), (20, '3.02', 510, 7, 0, 2),
            (21, '01', 440, 8, 0, 2), (22, '02', 440, 8, 0, 2), (23, 'Penthouse', 800, 9, 1, 3), (24, 'A1', 490, 10, 0, 2), (25, 'A2', 495, 10, 0, 2),
            (26, 'B1', 505, 10, 0, 2), (27, '1.1', 425, 11, 0, 2), (28, '1.2', 425, 11, 0, 2), (29, 'Gelijkvloers', 580, 12, 0, 2), (30, 'Dakapp', 700, 13, 1, 4);

            INSERT INTO `roomtype` (`id`, `type`) VALUES
            (1, 'Studio'),
            (2, 'Kamer'),
            (3, 'Appartement'),
            (4, 'Duplex');

            INSERT INTO `contract` (`id`, `user_id`, `room_id`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`) VALUES
            (1, 1, 1, '2025-09-01', NULL, 1, NOW(), NOW()), (2, 2, 2, '2025-09-01', NULL, 1, NOW(), NOW()), (3, 3, 3, '2025-09-01', NULL, 1, NOW(), NOW()),
            (4, 4, 4, '2025-09-01', NULL, 1, NOW(), NOW()), (5, 5, 5, '2025-09-01', NULL, 1, NOW(), NOW()), (6, 6, 6, '2025-09-01', NULL, 1, NOW(), NOW()),
            (7, 7, 7, '2025-09-01', NULL, 1, NOW(), NOW()), (8, 8, 8, '2025-09-01', NULL, 1, NOW(), NOW()), (9, 9, 9, '2025-09-01', NULL, 1, NOW(), NOW()),
            (10, 10, 10, '2025-09-01', NULL, 1, NOW(), NOW()), (11, 11, 11, '2025-09-01', NULL, 1, NOW(), NOW()), (12, 12, 12, '2025-09-01', NULL, 1, NOW(), NOW()),
            (13, 13, 13, '2025-09-01', NULL, 1, NOW(), NOW()), (14, 14, 14, '2025-09-01', NULL, 1, NOW(), NOW()), (15, 15, 15, '2025-09-01', NULL, 1, NOW(), NOW()),
            (16, 16, 16, '2025-09-01', NULL, 1, NOW(), NOW()), (17, 17, 17, '2025-09-01', NULL, 1, NOW(), NOW()), (18, 18, 18, '2025-09-01', NULL, 1, NOW(), NOW()),
            (19, 19, 19, '2025-09-01', NULL, 1, NOW(), NOW()), (20, 20, 20, '2025-09-01', NULL, 1, NOW(), NOW()), (21, 21, 21, '2025-09-01', NULL, 1, NOW(), NOW()),
            (22, 22, 22, '2025-09-01', NULL, 1, NOW(), NOW()), (23, 23, 23, '2025-09-01', NULL, 1, NOW(), NOW()), (24, 24, 24, '2025-09-01', NULL, 1, NOW(), NOW()),
            (25, 25, 25, '2025-09-01', NULL, 1, NOW(), NOW()), (26, 26, 26, '2025-09-01', NULL, 1, NOW(), NOW()), (27, 27, 27, '2025-09-01', NULL, 1, NOW(), NOW()),
            (28, 28, 28, '2025-09-01', NULL, 1, NOW(), NOW()), (29, 29, 29, '2025-09-01', NULL, 1, NOW(), NOW()), (30, 30, 30, '2025-09-01', NULL, 1, NOW(), NOW());

            -- 7. Complaints (TOEGEVOEGD: user_id)
            -- Ik heb hier willekeurige bestaande user ID's ingevuld (1, 2, 3, etc.) zodat de database klopt
            INSERT INTO `complaint` (`id`, `name`, `description`, `complaint_type_id`, `user_id`) VALUES
            (1, 'Lekkende kraan', 'Keukenkraan lekt constant.', 1, 1),
            (2, 'Geen warm water', 'Boiler geeft storing.', 1, 2),
            (3, 'Luidruchtige buren', 'Muziek na 22u.', 2, 3),
            (4, 'Wifi traag', 'Kan niet streamen.', 3, 4),
            (5, 'Vuilzakken gang', 'Buren laten vuilzakken staan.', 5, 5),
            (6, 'Deurbel stuk', 'Ik hoor niet als er iemand belt.', 1, 6),
            (7, 'Raam sluit niet', 'Raam straatkant klemt.', 1, 7),
            (8, 'Schimmel badkamer', 'Zwarte plekken op plafond.', 5, 8),
            (9, 'Internet valt uit', 'Modem herstart spontaan.', 3, 9),
            (10, 'Verwarming', 'Radiator lekt water.', 1, 10),
            (11, 'Muis gezien', 'In de keuken.', 5, 11),
            (12, 'Sleutel kwijt', 'Kan ik een reserve krijgen?', 4, 12),
            (13, 'Huurcontract vraag', 'Wanneer loopt het af?', 4, 13),
            (14, 'Lamp gang stuk', 'Het is donker op de trap.', 1, 14),
            (15, 'Lift defect', 'Staat vast op 2e.', 1, 15),
            (16, 'Geluid straat', 'Slecht geïsoleerd raam.', 2, 16),
            (17, 'Geurhinder', 'Rioolgeur in badkamer.', 5, 17),
            (18, 'Kookplaat barst', 'Barst in keramische plaat.', 1, 18),
            (19, 'Douchekop stuk', 'Water spuit alle kanten op.', 1, 19),
            (20, 'Toilet loopt door', 'Water blijft lopen.', 1, 20),
            (21, 'Rookmelder piept', 'Batterij leeg?', 1, 21),
            (22, 'Vochtplek muur', 'Naast het raam.', 1, 22),
            (23, 'Geen internet', 'Al 2 uur offline.', 3, 23),
            (24, 'Feestje buren', 'Te luid.', 2, 24),
            (25, 'Postbus kapot', 'Slotje werkt niet.', 1, 25),
            (26, 'Tegel los', 'Vloertegel badkamer.', 1, 26),
            (27, 'Stopcontact los', 'Gevaarlijk.', 1, 27),
            (28, 'Gordijnrail los', 'Naar beneden gekomen.', 1, 28),
            (29, 'Vaatwasser stuk', 'Pomp werkt niet.', 1, 29),
            (30, 'Afvoer verstopt', 'Douche loopt niet weg.', 1, 30);

            -- 8. Documenten (Met file_path, contract_id en nu ook room_id)
            -- Voor bestaande contract-documenten is room_id NULL.
            -- Ik voeg per kamer 1 afbeelding toe.
            INSERT INTO `document` (`id`, `name`, `file_path`, `document_type_id`, `user_id`, `contract_id`, `room_id`, `created_at`, `updated_at`) VALUES
            (1, 'Contract_Lotte.pdf', 'protected/contracts/1/Contract_Lotte.pdf', 1, 1, 1, NULL, NOW(), NOW()),
            (2, 'PB_Lotte.pdf', 'protected/contracts/1/PB_Lotte.pdf', 2, 1, 1, NULL, NOW(), NOW()),
            (3, 'Contract_Robbe.pdf', 'protected/contracts/2/Contract_Robbe.pdf', 1, 2, 2, NULL, NOW(), NOW()),
            (4, 'Contract_Noah.pdf', 'protected/contracts/3/Contract_Noah.pdf', 1, 3, 3, NULL, NOW(), NOW()),
            (5, 'Reglement_Gebouw1.pdf', 'protected/general/Reglement_Gebouw1.pdf', 3, 31, NULL, NULL, NOW(), NOW()),
            (6, 'Verzekering_Gebouw1.pdf', 'protected/general/Verzekering_Gebouw1.pdf', 4, 31, NULL, NULL, NOW(), NOW()),
            (7, 'Contract_Emma.pdf', 'protected/contracts/4/Contract_Emma.pdf', 1, 4, 4, NULL, NOW(), NOW()),
            (8, 'Contract_Arthur.pdf', 'protected/contracts/5/Contract_Arthur.pdf', 1, 5, 5, NULL, NOW(), NOW()),
            (9, 'PB_Arthur.pdf', 'protected/contracts/5/PB_Arthur.pdf', 2, 5, 5, NULL, NOW(), NOW()),
            (10, 'Contract_Mila.pdf', 'protected/contracts/6/Contract_Mila.pdf', 1, 6, 6, NULL, NOW(), NOW()),
            (11, 'EPC_Gebouw2.pdf', 'protected/general/EPC_Gebouw2.pdf', 5, 31, NULL, NULL, NOW(), NOW()),
            (12, 'Contract_Liam.pdf', 'protected/contracts/7/Contract_Liam.pdf', 1, 7, 7, NULL, NOW(), NOW()),
            (13, 'Contract_Olivia.pdf', 'protected/contracts/8/Contract_Olivia.pdf', 1, 8, 8, NULL, NOW(), NOW()),
            (14, 'Contract_Louis.pdf', 'protected/contracts/9/Contract_Louis.pdf', 1, 9, 9, NULL, NOW(), NOW()),
            (15, 'Contract_Louise.pdf', 'protected/contracts/10/Contract_Louise.pdf', 1, 10, 10, NULL, NOW(), NOW()),
            (16, 'PB_Louise.pdf', 'protected/contracts/10/PB_Louise.pdf', 2, 10, 10, NULL, NOW(), NOW()),
            (17, 'Contract_Lucas.pdf', 'protected/contracts/11/Contract_Lucas.pdf', 1, 11, 11, NULL, NOW(), NOW()),
            (18, 'Contract_Elise.pdf', 'protected/contracts/12/Contract_Elise.pdf', 1, 12, 12, NULL, NOW(), NOW()),
            (19, 'Contract_Adam.pdf', 'protected/contracts/13/Contract_Adam.pdf', 1, 13, 13, NULL, NOW(), NOW()),
            (20, 'Contract_Marie.pdf', 'protected/contracts/14/Contract_Marie.pdf', 1, 14, 14, NULL, NOW(), NOW()),
            (21, 'Contract_Jules.pdf', 'protected/contracts/15/Contract_Jules.pdf', 1, 15, 15, NULL, NOW(), NOW()),
            (22, 'Contract_Ella.pdf', 'protected/contracts/16/Contract_Ella.pdf', 1, 16, 16, NULL, NOW(), NOW()),
            (23, 'Contract_Victor.pdf', 'protected/contracts/17/Contract_Victor.pdf', 1, 17, 17, NULL, NOW(), NOW()),
            (24, 'Contract_Julie.pdf', 'protected/contracts/18/Contract_Julie.pdf', 1, 18, 18, NULL, NOW(), NOW()),
            (25, 'Contract_Gabriel.pdf', 'protected/contracts/19/Contract_Gabriel.pdf', 1, 19, 19, NULL, NOW(), NOW()),
            (26, 'Contract_Sarah.pdf', 'protected/contracts/20/Contract_Sarah.pdf', 1, 20, 20, NULL, NOW(), NOW()),
            (27, 'Contract_Mohamed.pdf', 'protected/contracts/21/Contract_Mohamed.pdf', 1, 21, 21, NULL, NOW(), NOW()),
            (28, 'Contract_Yasmine.pdf', 'protected/contracts/22/Contract_Yasmine.pdf', 1, 22, 22, NULL, NOW(), NOW()),
            (29, 'Contract_Thomas.pdf', 'protected/contracts/23/Contract_Thomas.pdf', 1, 23, 23, NULL, NOW(), NOW()),
            (30, 'Contract_Amber.pdf', 'protected/contracts/24/Contract_Amber.pdf', 1, 24, 24, NULL, NOW(), NOW()),
            -- Afbeeldingen (Type 7)
            (31, 'Kamer1.jpg', 'https://www.datocms-assets.com/76079/1744377653-kot-pic-3.png?fit=clip&fm=png&h=1080&w=1920', 7, NULL, NULL, 1, NOW(), NOW()),
            (32, 'Kamer2.jpg', 'images/rooms/default.jpg', 7, NULL, NULL, 2, NOW(), NOW()),
            (33, 'Kamer5.jpg', 'images/rooms/default.jpg', 7, NULL, NULL, 5, NOW(), NOW()),
            (34, 'Kamer13.jpg', 'images/rooms/default.jpg', 7, NULL, NULL, 13, NOW(), NOW());

            -- 9. Koppelingen
            INSERT INTO `facility_room` (`id`, `facility_id`, `room_id`) VALUES
            (1, 1, 1), (2, 6, 1), (3, 3, 1), (4, 1, 2), (5, 6, 2), (6, 3, 2), (7, 1, 3), (8, 6, 3), (9, 3, 3), (10, 1, 5),
            (11, 2, 5), (12, 4, 5), (13, 1, 13), (14, 2, 13), (15, 4, 13), (16, 5, 13), (17, 1, 15), (18, 3, 15), (19, 5, 15),
            (20, 1, 23), (21, 2, 23), (22, 4, 23), (23, 7, 23), (24, 8, 23), (25, 1, 30), (26, 2, 30), (27, 4, 30), (28, 6, 30), (29, 9, 30);

            INSERT INTO `complaint_document` (`id`, `complaint_id`, `document_id`) VALUES
            (1, 1, 1), (2, 5, 2), (3, 8, 5);

            -- 10. Berichten (Met sender_id en recipient_id)
            INSERT INTO `messages` (sender_id, recipient_id, content, is_read, created_at, updated_at) VALUES
            (1, 2, 'Welcome to the building! Please read the attached rules.', 1, '2023-10-01 09:00:00', '2023-10-01 09:05:00'),
            (1, 2, 'Just a reminder that rent is due on Friday.', 0, '2023-10-25 10:30:00', '2023-10-25 10:30:00'),
            (1, 3, 'Maintenance will be checking the fire alarms tomorrow at 2 PM.', 0, '2023-10-26 14:15:00', '2023-10-26 14:15:00'),
            (2, 1, 'Hi, the radiator in room 4B is making a strange noise.', 1, '2023-10-27 16:45:00', '2023-10-27 17:00:00'),
            (1, 4, 'Package left at the front desk for you.', 0, '2023-10-28 11:20:00', '2023-10-28 11:20:00'),
            (3, 1, 'Can I reserve the common room for Saturday night?', 0, '2023-10-29 09:10:00', '2023-10-29 09:10:00'),
            (1, 2, 'Water will be shut off for repairs on Tuesday from 9-11 AM.', 0, NOW(), NOW());
        SQL;

        DB::unprepared($sql);
        Schema::enableForeignKeyConstraints();
    }
}
