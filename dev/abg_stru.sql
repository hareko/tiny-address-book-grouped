-- 
-- Address Book Grouped
-- structure
--
-- @package Application
-- @author Vallo Reima
-- @copyright (C)2013

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `abook` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `abook`;

CREATE TABLE IF NOT EXISTS `cgroups` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `group_id` int(10) unsigned NOT NULL,
  `contact_id` int(10) unsigned NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `GROUPCONTACT` (`group_id`,`contact_id`),
  KEY `GROUP` (`group_id`),
  KEY `CONTACT` (`contact_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=19 ;

CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `fname` varchar(20) collate utf8_unicode_ci NOT NULL,
  `lname` varchar(20) collate utf8_unicode_ci NOT NULL,
  `street` varchar(30) collate utf8_unicode_ci NOT NULL,
  `zip` varchar(15) collate utf8_unicode_ci NOT NULL,
  `town_id` int(10) unsigned NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `PERSON` (`fname`,`lname`),
  KEY `TOWN` (`town_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=15 ;

CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(10) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `NAME` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=6 ;

CREATE TABLE IF NOT EXISTS `inherits` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `cgroup_id` int(10) unsigned NOT NULL,
  `group_id` int(10) unsigned NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `CGROUPGROUP` (`cgroup_id`,`group_id`),
  KEY `CGROUP` (`cgroup_id`),
  KEY `GROUP` (`group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=11 ;

CREATE TABLE IF NOT EXISTS `towns` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(25) collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=7 ;

ALTER TABLE `cgroups`
  ADD CONSTRAINT `CONTACTS` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `GROUPS` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON UPDATE CASCADE;

ALTER TABLE `contacts`
  ADD CONSTRAINT `town_key` FOREIGN KEY (`town_id`) REFERENCES `towns` (`id`) ON UPDATE CASCADE;

ALTER TABLE `inherits`
  ADD CONSTRAINT `ICGROUPS` FOREIGN KEY (`cgroup_id`) REFERENCES `cgroups` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `IGROUPS` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON UPDATE CASCADE;
