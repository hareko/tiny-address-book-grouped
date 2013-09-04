-- 
-- Address Book Grouped
-- data
--
-- @package Application
-- @author Vallo Reima
-- @copyright (C)2013

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

INSERT INTO `towns` (`id`, `name`) VALUES
(1, 'Oberdorf'),
(2, 'Tallinn'),
(3, 'London'),
(4, 'New York'),
(5, 'Tokyo'),
(6, 'Moscow');

INSERT INTO `contacts` (`id`, `fname`, `lname`, `street`, `zip`, `town_id`) VALUES
(1, 'John', 'Doe', '45. Street 11 apt. 4', '11200', 4),
(2, 'Иван', 'Денисович', 'Движенцев 17', '347658', 6),
(3, 'Ülle', 'Jõekäär', 'Šmidti 11', '20123', 2),
(4, 'Eric', 'Schwartz', 'Alpenstrasse 1', '4500', 1),
(5, 'Luis', 'Rodriguez', 'Manhattan', '11000', 4),
(6, 'Todd', 'Hamilton', 'Fulham Road', 'SW6 1EX', 3),
(7, 'Mito', 'Mitsuko', 'Hatagaya', '1-32-3', 5),
(8, 'Паша', 'Павличенко', 'Новоарбатское 6', '584248', 6),
(9, 'Ryan', 'Graham', 'Chelsea', 'SW1 9QJ', 3),
(10, 'Abby', 'Crary', '350 Fifth Avenue', '10118-', 4),
(11, 'Peeter', 'Tamm', 'Võidu 10', '11240', 2),
(12, 'Kobo', 'Abe', 'Mori Tower', '106-0032', 5),
(13, 'Leo', 'Klammer', 'Seeburgstrasse 53', '4515', 1),
(14, 'Villu', 'Veski', 'Vabaduse 1', '12300', 2);

INSERT INTO `groups` (`id`, `name`) VALUES
(1, 'GroupA'),
(2, 'GroupAA'),
(3, 'GroupB'),
(4, 'GroupC'),
(5, 'GroupD');

INSERT INTO `cgroups` (`id`, `group_id`, `contact_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 1),
(4, 2, 2),
(5, 3, 3),
(6, 3, 4),
(7, 4, 5),
(8, 4, 6),
(9, 4, 1),
(10, 4, 2),
(11, 5, 7),
(12, 5, 8),
(13, 5, 1),
(14, 5, 2),
(15, 5, 3),
(16, 5, 4),
(17, 5, 5),
(18, 5, 6);

INSERT INTO `inherits` (`id`, `cgroup_id`, `group_id`) VALUES
(1, 9, 1),
(2, 10, 1),
(3, 13, 2),
(4, 13, 4),
(5, 14, 2),
(6, 14, 4),
(7, 15, 3),
(8, 16, 3),
(9, 17, 4),
(10, 18, 4);
