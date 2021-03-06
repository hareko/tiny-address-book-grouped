# Tiny Address Book Grouped #

This demo application shows the design and programming techniques used in my projects. Some of the components of vRegistry framework are used. All the code is original (except some standard functions).

## Functionality ##

The main menu sections *Contacts* and *Groups* switch to according action, *Finish* terminates. A language can be specified on startup by *lng=key* (key *en* is default, *ru* exists, *de* dictionary is empty).

### Contacts ###

The database consists of *contacts* and *towns* tables containing First & Last Name, Street, Postcode and Town data. The records can be added, deleted or modified. The table can be browsed and saved in XML format. Double-clicking on the row selects the record for editing. The towns list must be edited outside.

### Groups ###

The enhanced version allows to form the groups. The *cgroups* & *inherits* relations and *groups* tables hold the grouping data. The contacts can be added to a group or inherited from another group. Clicking the table row selects the contact(s) to be added or removed. The reports allow to query the groups membership and inheritance.  The groups list must be edited outside.

**The demo is uploaded on [arc.vallo.me/abg].**

## Design & programming ##

OOP MVC principles are followed both on the back and front end. The AJAX is used for client-server communications. See 
[app.vregistry.com] regarding the techniques.

## Requirements ##

- Webserver: Apache or IIS supporting PHP and MySql
- PHP: version 5.4+, PDO mysql and sqlite extensions
- MySql: version 5+, Innodb engine
- JavaScript: 1.5+ version
- Browser: any common (IE, FF, Chrome, Safari, Opera,...), newer version

## Installation ##

Unpack the *abk.zip* to your local/remote webserver retaining the folder structure. Create and load the MySql database from the *sql* files supplied. Find/change the connection properties in the configuration file */pri/abk/abk.xml* (node *db*):

- nme - database name
- usr - access username
- pwd - access password
- pfx - database and username prefix (if hosting requires)

## File structure ##

The files are arranged in folders according to their scope and functionality.

### Folders ###

The root folder contains default startup. The folders:

- *pri* - private server-side files; subfolders:
 + *abk* - application files
 + *sys* - framework files
 + *tmp* - temporary workfiles
- *pub* - public client-side files; subfolders:
 + *js* - JavaScript code
 + *css* - stylesheets
 + *pic* - images
- *dev* - miscellaneous development data

The *abk* and *sys* folders (may) have the subfolders:

- *_act* - actions PHP code *.php
- *_css* - dynamic CSS code *.css
- *_js* - dynamic JavaScript code *.js
- *_lib* - PHP classes *.php
- *_srv* - action's PHP services *.inc
- *_tpl* - htm templates *.phtml

### Files ###

- *index.php* - startup
- *php.php* - check PHP version
- *pri/.htaccess* - deny access
- *pri/gateway* - common data gateway
- *pri/startup* - bootstrap
- *dev/abg_data.sql* - MySql data loading queries
- *dev/abg_stru.sql* - MySql structure queries
- *pri/abk/abk.db* - dictionary
- *pri/abk/abk.xml* - configuration
- *pri/abk/_act/abook.php* - main panel creator
- *pri/abk/_act/finish.php* - bye panel creator
- *pri/abk/_act/group.php* - group panel creator
- *pri/abk/_act/shell.php* - shell creator
- *pri/abk/_act/tables.php* -table creation
- *pri/abk/_act/shell.php* - layout creator
- *pri/abk/_css/abook.css* - contacts style
- *pri/abk/_css/group.css* - groups style
- *pri/abk/_css/shell.css* - layout style
- *pri/abk/_js/shell.js* - dispatcher class
- *pri/abk/_js/abook.js* - contacts editor/browser class
- *pri/abk/_js/group.js* - groups editor/query class
- *pri/abk/_lib/Frontal.php* - front controller class
- *pri/abk/_lib/Tables.php* - table manipulation class
- *pri/abk/_srv/abook.inc* - data manipulation
- *pri/abk/_srv/group.inc* - groups manipulation
- *pri/abk/_srv/shell.inc* - on-demand loader
- *pri/abk/_srv/table.inc* - tables services
- *pri/abk/_tpl/abook.phtml* - panel template
- *pri/abk/_tpl/group.phtml* - groups template
- *pri/abk/_tpl/shell.phtml* - layout template
- *pri/abk/_tpl/tables.phtml* - table template
- *pri/sys/_act/download.php* - file download dialogue
- *pri/sys/_lib/Base.php* - base functionality class
- *pri/sys/_lib/Common.php* - common methods & properties class
- *pri/sys/_lib/Database.php* - database abstraction layer class
- *pri/sys/_lib/IData.php* - database I/O layer interface
- *pri/sys/_lib/Mypdo.php* - PDO I/O layer
- *pri/sys/_lib/Texts.php* - multilingual texts class
- *pri/sys/_tpl/exit.phtml* - finish/error panel template
- *pri/sys/_tpl/exits.phtml* - exit panel shell template
- *pub/css/base.css* - global styles
- *pub/css/msie.css* - IE-specific styles
- *pub/js/base.js* - basic JS functionality
- *pub/js/common.js* - common functions and classes


[app.vregistry.com]: http://app.vregistry.com/hlp/en/spgm
[arc.vallo.me/abg]: http://arc.vallo.me/abg
