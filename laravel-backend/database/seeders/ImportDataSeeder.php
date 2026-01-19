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
            (1, 'Naamsestraat'), (2, 'Oude Markt'), (3, 'Bondgenotenlaan'), (4, 'Tiensestraat'), (5, 'Brusselsestraat'), -- Leuven
            (11, 'Nationalestraat'), (12, 'Meir'), (13, 'Italiëlei'), (14, 'Prinsstraat'), (15, 'Kloosterstraat'), -- Antwerpen
            (21, 'Kempische Steenweg'), (22, 'Elfde-Liniestraat'), (23, 'Koning Albertstraat'), (24, 'Demerstraat'), (25, 'Grote Markt'); -- Hasselt

            INSERT INTO `place` (`id`, `place`, `zipcode`) VALUES
            (1, 'Leuven', 3000), 
            (7, 'Antwerpen', 2000), 
            (10, 'Hasselt', 3500);

            -- 3. Types en Faciliteiten
            INSERT INTO `complainttype` (`id`, `type`) VALUES (1, 'Technisch defect'), (2, 'Geluidsoverlast'), (3, 'Internet'), (4, 'Administratie'), (5, 'Hygiëne');
            INSERT INTO `documenttype` (id, `type`) VALUES (1, 'Huurcontract'), (2, 'Plaatsbeschrijving'), (3, 'Huishoudelijk Reglement'), (4, 'Brandverzekering'), (5, 'EPC Attest'), (6, 'Klacht'), (7, 'Kamerafbeelding'), (8, 'Profielfoto'), (9, 'Kamergallerij');
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
            (41, 'Micciche', 'Alessio', '$2y$12$hX9vntjAtmV71O0Z0qId/u.vd.Vzt09a/cPhKj9wFEMaFiXVS9tUK', '0487192277', 'alessiomicciche@outlook.com', 10, 3, NOW(), NOW()),
            (42, 'test', 'verhuurder', '$2y$12$hX9vntjAtmV71O0Z0qId/u.vd.Vzt09a/cPhKj9wFEMaFiXVS9tUK', '123456789', 'test@verhuurder.com', 20, 2, NOW(), NOW()),
            (43, 'test', 'huurder', '$2y$12$hX9vntjAtmV71O0Z0qId/u.vd.Vzt09a/cPhKj9wFEMaFiXVS9tUK', '0412345678', 'test@huurder.com', 5, 1, NOW(), NOW()),
            (44, 'test', 'admin', '$2y$12$hX9vntjAtmV71O0Z0qId/u.vd.Vzt09a/cPhKj9wFEMaFiXVS9tUK', '0412345678', 'test@admin.com', 20000, 3, NOW(), NOW());


            -- 3. GEBOUWEN (Totaal 13 gebouwen voor 30 koten)
            INSERT INTO `building` (`id`, `street_id`, `housenumber`, `place_id`, `user_id`) VALUES
            -- LEUVEN (5 Gebouwen: 3x User 42, 2x User 31)
            (1, 1, '10', 1, 42),  -- Naamsestraat: Studentenhuis (4 koten) - Eigenaar 42
            (2, 2, '5', 1, 42),   -- Oude Markt: Apart Gebouw (1 studio) - Eigenaar 42
            (3, 3, '88', 1, 31),  -- Bondg.laan: Klein complex (3 koten) - Eigenaar 31
            (4, 4, '12', 1, 31),  -- Tiensestraat: Apart Gebouw (1 kot) - Eigenaar 31
            (5, 5, '3A', 1, 42),  -- Brusselsestr: Apart Gebouw (1 studio) - Eigenaar 42
            
            -- ANTWERPEN (4 Gebouwen: 2x User 42, 2x User 31)
            (6, 11, '50', 7, 42), -- Nationalestr: Loft Gebouw (1 groot app) - Eigenaar 42
            (7, 12, '1', 7, 31),  -- Meir: Groot Studentenhuis (5 koten) - Eigenaar 31
            (8, 13, '22', 7, 42), -- Italiëlei: Huis (3 koten) - Eigenaar 42
            (9, 14, '9', 7, 42),  -- Prinsstraat: Apart Gebouw (1 kot) - Eigenaar 42

            -- HASSELT (4 Gebouwen: 2x User 42, 2x User 31)
            (10, 21, '100', 10, 31), -- Kempische Stw: Apart Huisje (1 kot) - Eigenaar 31
            (11, 22, '12A', 10, 42), -- Elfde-Liniestr: Apart Kot (1 kot) - Eigenaar 42
            (12, 23, '44', 10, 31),  -- Koning Albert: Residentie (4 koten) - Eigenaar 31
            (13, 24, '8', 10, 42);   -- Demerstraat: Gerenoveerd Huis (4 koten) - Eigenaar 42


            -- 4. KOTEN (30 stuks)
            INSERT INTO `room` (`id`, `roomnumber`, `price`, `building_id`, `is_highlighted`, `roomtype_id`) VALUES
            -- LEUVEN (10 units)
            (1, '0.01', 520, 1, 1, 2), (2, '1.01', 490, 1, 0, 2), (3, '1.02', 490, 1, 0, 2), (4, '2.01', 510, 1, 0, 2), -- Gebouw 1 (User 42)
            (5, 'Studio', 650, 2, 1, 1), -- Gebouw 2 (User 42) -> ALLEENSTAAND
            (6, 'K1', 400, 3, 0, 2), (7, 'K2', 410, 3, 0, 2), (8, 'K3', 420, 3, 0, 2), -- Gebouw 3 (User 31)
            (9, 'GLV', 450, 4, 0, 2), -- Gebouw 4 (User 31) -> ALLEENSTAAND
            (10, 'Penthouse', 700, 5, 1, 1), -- Gebouw 5 (User 42) -> ALLEENSTAAND
            
            -- ANTWERPEN (10 units)
            (11, 'Loft 1', 850, 6, 1, 3), -- Gebouw 6 (User 42) -> ALLEENSTAAND APP
            (12, '101', 380, 7, 0, 2), (13, '102', 390, 7, 0, 2), (14, '201', 400, 7, 0, 2), (15, '202', 410, 7, 0, 2), (16, '301', 420, 7, 0, 2), -- Gebouw 7 (User 31)
            (17, 'A', 500, 8, 0, 2), (18, 'B', 500, 8, 0, 2), (19, 'C', 520, 8, 0, 2), -- Gebouw 8 (User 42)
            (20, 'Gelijkvloers', 550, 9, 0, 1), -- Gebouw 9 (User 42) -> ALLEENSTAAND
            
            -- HASSELT (10 units)
            (21, 'Huisje', 480, 10, 1, 2), -- Gebouw 10 (User 31) -> ALLEENSTAAND
            (22, 'Unit 1', 460, 11, 0, 2), -- Gebouw 11 (User 42) -> ALLEENSTAAND
            (23, 'K1', 350, 12, 0, 2), (24, 'K2', 360, 12, 0, 2), (25, 'K3', 360, 12, 0, 2), (26, 'K4', 375, 12, 0, 2), -- Gebouw 12 (User 31)
            (27, 'A', 490, 13, 0, 2), (28, 'B', 495, 13, 0, 2), (29, 'C', 510, 13, 0, 2), (30, 'D', 520, 13, 0, 2); -- Gebouw 13 (User 42)

            INSERT INTO `roomtype` (`id`, `type`) VALUES
            (1, 'Studio'),
            (2, 'Kamer'),
            (3, 'Appartement'),
            (4, 'Duplex');

            INSERT INTO `extracost` (`id`, `name`, `is_recurring`) VALUES
            (1, 'Wifi', 1),
            (2, 'Gas/Water/Elektro', 1),
            (3, 'Waarborg', 0),
            (4, 'Poetsdienst', 1);

            
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

            -- 6. FOTO'S (Elke kamer krijgt 1 Main foto en 5 Gallerij foto's)
            INSERT INTO `document` (`name`, `file_path`, `document_type_id`, `room_id`, `created_at`, `updated_at`) VALUES
            
            -- KAMER 1 (Leuven)
            ('K1_Main', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', 7, 1, NOW(), NOW()),
            ('K1_1', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800', 9, 1, NOW(), NOW()),
            ('K1_2', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 9, 1, NOW(), NOW()),
            ('K1_3', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800', 9, 1, NOW(), NOW()),
            ('K1_4', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800', 9, 1, NOW(), NOW()),
            ('K1_5', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 1, NOW(), NOW()),

            -- KAMER 2 (Leuven)
            ('K2_Main', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 7, 2, NOW(), NOW()),
            ('K2_1', 'https://images.unsplash.com/photo-1522771753035-1a5b6519ad41?w=800', 9, 2, NOW(), NOW()),
            ('K2_2', 'https://images.unsplash.com/photo-1505693416388-b0346efee535?w=800', 9, 2, NOW(), NOW()),
            ('K2_3', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', 9, 2, NOW(), NOW()),
            ('K2_4', 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800', 9, 2, NOW(), NOW()),
            ('K2_5', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800', 9, 2, NOW(), NOW()),

            -- KAMER 3 (Leuven)
            ('K3_Main', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 7, 3, NOW(), NOW()),
            ('K3_1', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 3, NOW(), NOW()),
            ('K3_2', 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800', 9, 3, NOW(), NOW()),
            ('K3_3', 'https://images.unsplash.com/photo-1507919909716-c82196f29958?w=800', 9, 3, NOW(), NOW()),
            ('K3_4', 'https://images.unsplash.com/photo-1556912173-3db996ea0622?w=800', 9, 3, NOW(), NOW()),
            ('K3_5', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', 9, 3, NOW(), NOW()),

            -- KAMER 4 (Leuven)
            ('K4_Main', 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800', 7, 4, NOW(), NOW()),
            ('K4_1', 'https://images.unsplash.com/photo-1505692794406-8c70752538f6?w=800', 9, 4, NOW(), NOW()),
            ('K4_2', 'https://images.unsplash.com/photo-1510563800743-aed236490d08?w=800', 9, 4, NOW(), NOW()),
            ('K4_3', 'https://images.unsplash.com/photo-1507473888900-52e1adad70ac?w=800', 9, 4, NOW(), NOW()),
            ('K4_4', 'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=800', 9, 4, NOW(), NOW()),
            ('K4_5', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', 9, 4, NOW(), NOW()),

            -- KAMER 5 (Leuven - Studio)
            ('K5_Main', 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800', 7, 5, NOW(), NOW()),
            ('K5_1', 'https://images.unsplash.com/photo-1515516947640-36491c67f990?w=800', 9, 5, NOW(), NOW()),
            ('K5_2', 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800', 9, 5, NOW(), NOW()),
            ('K5_3', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800', 9, 5, NOW(), NOW()),
            ('K5_4', 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?w=800', 9, 5, NOW(), NOW()),
            ('K5_5', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 9, 5, NOW(), NOW()),

            -- KAMER 6 (Leuven)
            ('K6_Main', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800', 7, 6, NOW(), NOW()),
            ('K6_1', 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800', 9, 6, NOW(), NOW()),
            ('K6_2', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800', 9, 6, NOW(), NOW()),
            ('K6_3', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 6, NOW(), NOW()),
            ('K6_4', 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800', 9, 6, NOW(), NOW()),
            ('K6_5', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 9, 6, NOW(), NOW()),

            -- KAMER 7 (Leuven)
            ('K7_Main', 'https://images.unsplash.com/photo-1588854337473-b76011c536e7?w=800', 7, 7, NOW(), NOW()),
            ('K7_1', 'https://images.unsplash.com/photo-1587069300649-6f5c8ac2df85?w=800', 9, 7, NOW(), NOW()),
            ('K7_2', 'https://images.unsplash.com/photo-1616594039964-40891a909672?w=800', 9, 7, NOW(), NOW()),
            ('K7_3', 'https://images.unsplash.com/photo-1596048563359-598d9c22d10f?w=800', 9, 7, NOW(), NOW()),
            ('K7_4', 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=800', 9, 7, NOW(), NOW()),
            ('K7_5', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800', 9, 7, NOW(), NOW()),

            -- KAMER 8 (Leuven)
            ('K8_Main', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', 7, 8, NOW(), NOW()),
            ('K8_1', 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800', 9, 8, NOW(), NOW()),
            ('K8_2', 'https://images.unsplash.com/photo-1507473888900-52e1adad70ac?w=800', 9, 8, NOW(), NOW()),
            ('K8_3', 'https://images.unsplash.com/photo-1502005229766-939760a58531?w=800', 9, 8, NOW(), NOW()),
            ('K8_4', 'https://images.unsplash.com/photo-1522771753035-1a5b6519ad41?w=800', 9, 8, NOW(), NOW()),
            ('K8_5', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', 9, 8, NOW(), NOW()),

            -- KAMER 9 (Leuven - Apart)
            ('K9_Main', 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800', 7, 9, NOW(), NOW()),
            ('K9_1', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 9, NOW(), NOW()),
            ('K9_2', 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800', 9, 9, NOW(), NOW()),
            ('K9_3', 'https://images.unsplash.com/photo-1510563800743-aed236490d08?w=800', 9, 9, NOW(), NOW()),
            ('K9_4', 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800', 9, 9, NOW(), NOW()),
            ('K9_5', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 9, 9, NOW(), NOW()),

            -- KAMER 10 (Leuven - Penthouse)
            ('K10_Main', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800', 7, 10, NOW(), NOW()),
            ('K10_1', 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800', 9, 10, NOW(), NOW()),
            ('K10_2', 'https://images.unsplash.com/photo-1513506003011-3b03c80165bd?w=800', 9, 10, NOW(), NOW()),
            ('K10_3', 'https://images.unsplash.com/photo-1463320726281-696a413703b6?w=800', 9, 10, NOW(), NOW()),
            ('K10_4', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', 9, 10, NOW(), NOW()),
            ('K10_5', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800', 9, 10, NOW(), NOW()),

            -- KAMER 11 (Antwerpen - Loft)
            ('K11_Main', 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800', 7, 11, NOW(), NOW()),
            ('K11_1', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 9, 11, NOW(), NOW()),
            ('K11_2', 'https://images.unsplash.com/photo-1507473888900-52e1adad70ac?w=800', 9, 11, NOW(), NOW()),
            ('K11_3', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800', 9, 11, NOW(), NOW()),
            ('K11_4', 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800', 9, 11, NOW(), NOW()),
            ('K11_5', 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800', 9, 11, NOW(), NOW()),

            -- KAMER 12 (Antwerpen)
            ('K12_Main', 'https://images.unsplash.com/photo-1522771753035-1a5b6519ad41?w=800', 7, 12, NOW(), NOW()),
            ('K12_1', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800', 9, 12, NOW(), NOW()),
            ('K12_2', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 12, NOW(), NOW()),
            ('K12_3', 'https://images.unsplash.com/photo-1510563800743-aed236490d08?w=800', 9, 12, NOW(), NOW()),
            ('K12_4', 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800', 9, 12, NOW(), NOW()),
            ('K12_5', 'https://images.unsplash.com/photo-1505693416388-b0346efee535?w=800', 9, 12, NOW(), NOW()),

            -- KAMER 13 (Antwerpen)
            ('K13_Main', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', 7, 13, NOW(), NOW()),
            ('K13_1', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 13, NOW(), NOW()),
            ('K13_2', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', 9, 13, NOW(), NOW()),
            ('K13_3', 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800', 9, 13, NOW(), NOW()),
            ('K13_4', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', 9, 13, NOW(), NOW()),
            ('K13_5', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800', 9, 13, NOW(), NOW()),

            -- KAMER 14 (Antwerpen)
            ('K14_Main', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 7, 14, NOW(), NOW()),
            ('K14_1', 'https://images.unsplash.com/photo-1515516947640-36491c67f990?w=800', 9, 14, NOW(), NOW()),
            ('K14_2', 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800', 9, 14, NOW(), NOW()),
            ('K14_3', 'https://images.unsplash.com/photo-1510563800743-aed236490d08?w=800', 9, 14, NOW(), NOW()),
            ('K14_4', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800', 9, 14, NOW(), NOW()),
            ('K14_5', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800', 9, 14, NOW(), NOW()),

            -- KAMER 15 (Antwerpen)
            ('K15_Main', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 7, 15, NOW(), NOW()),
            ('K15_1', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 9, 15, NOW(), NOW()),
            ('K15_2', 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?w=800', 9, 15, NOW(), NOW()),
            ('K15_3', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800', 9, 15, NOW(), NOW()),
            ('K15_4', 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800', 9, 15, NOW(), NOW()),
            ('K15_5', 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800', 9, 15, NOW(), NOW()),

            -- KAMER 16 (Antwerpen)
            ('K16_Main', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800', 7, 16, NOW(), NOW()),
            ('K16_1', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', 9, 16, NOW(), NOW()),
            ('K16_2', 'https://images.unsplash.com/photo-1507473888900-52e1adad70ac?w=800', 9, 16, NOW(), NOW()),
            ('K16_3', 'https://images.unsplash.com/photo-1513506003011-3b03c80165bd?w=800', 9, 16, NOW(), NOW()),
            ('K16_4', 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800', 9, 16, NOW(), NOW()),
            ('K16_5', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', 9, 16, NOW(), NOW()),

            -- KAMER 17 (Antwerpen)
            ('K17_Main', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', 7, 17, NOW(), NOW()),
            ('K17_1', 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800', 9, 17, NOW(), NOW()),
            ('K17_2', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 17, NOW(), NOW()),
            ('K17_3', 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800', 9, 17, NOW(), NOW()),
            ('K17_4', 'https://images.unsplash.com/photo-1556912173-3db996ea0622?w=800', 9, 17, NOW(), NOW()),
            ('K17_5', 'https://images.unsplash.com/photo-1505693416388-b0346efee535?w=800', 9, 17, NOW(), NOW()),

            -- KAMER 18 (Antwerpen)
            ('K18_Main', 'https://images.unsplash.com/photo-1522771753035-1a5b6519ad41?w=800', 7, 18, NOW(), NOW()),
            ('K18_1', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800', 9, 18, NOW(), NOW()),
            ('K18_2', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 18, NOW(), NOW()),
            ('K18_3', 'https://images.unsplash.com/photo-1505692794406-8c70752538f6?w=800', 9, 18, NOW(), NOW()),
            ('K18_4', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', 9, 18, NOW(), NOW()),
            ('K18_5', 'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=800', 9, 18, NOW(), NOW()),

            -- KAMER 19 (Antwerpen)
            ('K19_Main', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 7, 19, NOW(), NOW()),
            ('K19_1', 'https://images.unsplash.com/photo-1510563800743-aed236490d08?w=800', 9, 19, NOW(), NOW()),
            ('K19_2', 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800', 9, 19, NOW(), NOW()),
            ('K19_3', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800', 9, 19, NOW(), NOW()),
            ('K19_4', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800', 9, 19, NOW(), NOW()),
            ('K19_5', 'https://images.unsplash.com/photo-1507473888900-52e1adad70ac?w=800', 9, 19, NOW(), NOW()),

            -- KAMER 20 (Antwerpen)
            ('K20_Main', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 7, 20, NOW(), NOW()),
            ('K20_1', 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800', 9, 20, NOW(), NOW()),
            ('K20_2', 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800', 9, 20, NOW(), NOW()),
            ('K20_3', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 9, 20, NOW(), NOW()),
            ('K20_4', 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800', 9, 20, NOW(), NOW()),
            ('K20_5', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800', 9, 20, NOW(), NOW()),

            -- KAMER 21 (Hasselt)
            ('K21_Main', 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800', 7, 21, NOW(), NOW()),
            ('K21_1', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 21, NOW(), NOW()),
            ('K21_2', 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800', 9, 21, NOW(), NOW()),
            ('K21_3', 'https://images.unsplash.com/photo-1505693416388-b0346efee535?w=800', 9, 21, NOW(), NOW()),
            ('K21_4', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800', 9, 21, NOW(), NOW()),
            ('K21_5', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 9, 21, NOW(), NOW()),

            -- KAMER 22 (Hasselt)
            ('K22_Main', 'https://images.unsplash.com/photo-1522771753035-1a5b6519ad41?w=800', 7, 22, NOW(), NOW()),
            ('K22_1', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800', 9, 22, NOW(), NOW()),
            ('K22_2', 'https://images.unsplash.com/photo-1507473888900-52e1adad70ac?w=800', 9, 22, NOW(), NOW()),
            ('K22_3', 'https://images.unsplash.com/photo-1510563800743-aed236490d08?w=800', 9, 22, NOW(), NOW()),
            ('K22_4', 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?w=800', 9, 22, NOW(), NOW()),
            ('K22_5', 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800', 9, 22, NOW(), NOW()),

            -- KAMER 23 (Hasselt)
            ('K23_Main', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', 7, 23, NOW(), NOW()),
            ('K23_1', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 23, NOW(), NOW()),
            ('K23_2', 'https://images.unsplash.com/photo-1515516947640-36491c67f990?w=800', 9, 23, NOW(), NOW()),
            ('K23_3', 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800', 9, 23, NOW(), NOW()),
            ('K23_4', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800', 9, 23, NOW(), NOW()),
            ('K23_5', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', 9, 23, NOW(), NOW()),

            -- KAMER 24 (Hasselt)
            ('K24_Main', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800', 7, 24, NOW(), NOW()),
            ('K24_1', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', 9, 24, NOW(), NOW()),
            ('K24_2', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 9, 24, NOW(), NOW()),
            ('K24_3', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', 9, 24, NOW(), NOW()),
            ('K24_4', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800', 9, 24, NOW(), NOW()),
            ('K24_5', 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800', 9, 24, NOW(), NOW()),

            -- KAMER 25 (Hasselt)
            ('K25_Main', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 7, 25, NOW(), NOW()),
            ('K25_1', 'https://images.unsplash.com/photo-1510563800743-aed236490d08?w=800', 9, 25, NOW(), NOW()),
            ('K25_2', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800', 9, 25, NOW(), NOW()),
            ('K25_3', 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800', 9, 25, NOW(), NOW()),
            ('K25_4', 'https://images.unsplash.com/photo-1505693416388-b0346efee535?w=800', 9, 25, NOW(), NOW()),
            ('K25_5', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 25, NOW(), NOW()),

            -- KAMER 26 (Hasselt)
            ('K26_Main', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 7, 26, NOW(), NOW()),
            ('K26_1', 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800', 9, 26, NOW(), NOW()),
            ('K26_2', 'https://images.unsplash.com/photo-1507473888900-52e1adad70ac?w=800', 9, 26, NOW(), NOW()),
            ('K26_3', 'https://images.unsplash.com/photo-1513506003011-3b03c80165bd?w=800', 9, 26, NOW(), NOW()),
            ('K26_4', 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800', 9, 26, NOW(), NOW()),
            ('K26_5', 'https://images.unsplash.com/photo-1522771753035-1a5b6519ad41?w=800', 9, 26, NOW(), NOW()),

            -- KAMER 27 (Hasselt)
            ('K27_Main', 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800', 7, 27, NOW(), NOW()),
            ('K27_1', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 27, NOW(), NOW()),
            ('K27_2', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800', 9, 27, NOW(), NOW()),
            ('K27_3', 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800', 9, 27, NOW(), NOW()),
            ('K27_4', 'https://images.unsplash.com/photo-1505692794406-8c70752538f6?w=800', 9, 27, NOW(), NOW()),
            ('K27_5', 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800', 9, 27, NOW(), NOW()),

            -- KAMER 28 (Hasselt)
            ('K28_Main', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', 7, 28, NOW(), NOW()),
            ('K28_1', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', 9, 28, NOW(), NOW()),
            ('K28_2', 'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=800', 9, 28, NOW(), NOW()),
            ('K28_3', 'https://images.unsplash.com/photo-1507473888900-52e1adad70ac?w=800', 9, 28, NOW(), NOW()),
            ('K28_4', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', 9, 28, NOW(), NOW()),
            ('K28_5', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 28, NOW(), NOW()),

            -- KAMER 29 (Hasselt)
            ('K29_Main', 'https://images.unsplash.com/photo-1522771753035-1a5b6519ad41?w=800', 7, 29, NOW(), NOW()),
            ('K29_1', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 9, 29, NOW(), NOW()),
            ('K29_2', 'https://images.unsplash.com/photo-1510563800743-aed236490d08?w=800', 9, 29, NOW(), NOW()),
            ('K29_3', 'https://images.unsplash.com/photo-1556912173-3db996ea0622?w=800', 9, 29, NOW(), NOW()),
            ('K29_4', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800', 9, 29, NOW(), NOW()),
            ('K29_5', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800', 9, 29, NOW(), NOW()),

            -- KAMER 30 (Hasselt)
            ('K30_Main', 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800', 7, 30, NOW(), NOW()),
            ('K30_1', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800', 9, 30, NOW(), NOW()),
            ('K30_2', 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800', 9, 30, NOW(), NOW()),
            ('K30_3', 'https://images.unsplash.com/photo-1513506003011-3b03c80165bd?w=800', 9, 30, NOW(), NOW()),
            ('K30_4', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 9, 30, NOW(), NOW()),
            ('K30_5', 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800', 9, 30, NOW(), NOW());

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