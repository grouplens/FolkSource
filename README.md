# Backend Server
In order to setup the back-end server, you'll need a few things to start:

1. a postgressql installation (>9.2)
2. a postGIS installation (>= 2.0)
3. Download and unzip a version of tomcat from https://tomcat.apache.org/download-70.cgi, and remember the path
4. a clone of the DB (talk to @jtsmn)
5. EGit installed in Eclipse
6. Maven2Eclipse installed in Eclipse (and a local isntallation of maven).

## Installing PostgreSQL

1. Once you install PostgreSQL for your system, remember the username and
   password.
2. Ensure that you have access to the 'psql' command-line too.
3. Import the database clone you've received:

	> psql -U [username] -d [database_name] < database_clone

	You can ignore warnings about not having the right user.

4. Remember which user name, which password, and which database name you used
   (for the section called "Setting up your pom.xml properly". 

## installing Egit
1. In Elipse

	> Help -> Install New Software...

2. Search for 

	> egit

	and install everything that comes up.

## installing M2Eclipse
1. In Eclipse

	> Help -> Install New Software...

	and in the URL box, put 

	> http://download.eclipse.org/technology/m2e/releases
	
	and then install everything that seems related to Maven.
	
## Setting up your repository
1. Fork http://github.com/grouplens/FolkSource through the GitHub site
2. In Eclipse

	> Window -> Show View -> Other

3. Then search for "git", and chose the 'Git Repositories' view
	This will open a git repository view, you'll then choose the fourth icon in from
	the left, that has the tooltip

	> Clone a Git Repository and add the clone to this view

4. In the URI field, put http://github.com/your-username/FolkSource.git. 
	1. The rest should fill in. It probably makes sense to save your authenitcation (github username and password) now, but you don't need to. 
5. Click Next
6. Uncheck all branches, except the 'master' branch (since it's your fork, the rest don't matter). 
7. Click Next
8. Choose the path where where you want to checkout your clone. Decide if you
	want to change the name of the 'Remote Name' (you probably don't need to).
	1. Make sure the "clone submodules" checkbox is checked
9. Click Finish
10. Once it finishes cloning your fork:
	1. Navigate that tree, and find the

		> Working Directory -> backend 

		directory. 

	2. Right click, and choose the

		> Import projects

		menu item.

	3. This will present you with an import wizard, choose the

		> Import as a general project

		radio button. Choose 'next', and give your project a name.

	4. This should then create an eclipse project. Right click on it, and choose

		> Team -> Switch to... -> New Branch

		Ensure that "Source ref" is set to 

		> refs/heads/master

		and that the "Checkout new branch" check box is checked.

	5. Name your branch

		> lastName_description_of_feature

		and then go ahead and finish. 

You should now be setup properly to edit the server backed in Eclipse.

## Setting up your pom.xml properly
For all of the settings below, remember that you DO NOT need the brackets ([]). 

1. On line 11 of your pom.xml, change where it says '[DB_USERNAME]' to the
   username you remembered from above
2. On line 12, change '[DB_PASSWORD]' to the password you remembered from above
3. On line 15, change '[DB_NAME]' to the database username you remembered from
   above
4. On line 105, change '[PATH TO TOMCAT INSTALL]' to the path where you unzipped
   your tomcat download from above. 

## Converting a project to be a maven project
1. Right click on the project you've added, and choose the 

	> Configure...

	menu item. Pick 

	> Convert to Maven project...

and fill in something for the required fields. 

2. Setup a run configuration for this project, using

	> clean package cargo:start

	as the 'Goals'.

This will allow you start the server through eclipse by using the Run
Configuration you just setup.

# Web

# Mobile

