# Backend Server
In order to setup the back-end server, you'll need a few things to start:
* a postgressql installation (>9.2)
* a postGIS installation (>= 2.0)
* a clone of the DB (talk to @jtsmn)
* EGit installed in Eclipse
* Maven2Eclipse installed in Eclipse (and a local isntallation of maven).

## installing Egit
* In Elipse

	> Help -> Install New Software...

* Search for 

	> egit

	and install everything that comes up.

## installing M2Eclipse
* In Eclipse

	> Help -> Install New Software...

	and in the URL box, put 

	> http://www.eclipse.org/m2e/download/
	
	and then install everything that seems related to Maven.
	
## Setting up your repository
* Fork http://github.com/grouplens/FolkSource through the GitHub site
* In Eclipse

	> Window -> Show View -> Other

* Then search for "git", and chose the 'Git Repositories' view
	This will open a git repository view, you'll then choose the fourth icon in from
	the left, that has the tooltip

	> Clone a Git Repository and add the clone to this view

* In the URI field, put http://github.com/\<your-username\>/FolkSource.git. 
	* The rest should fill in. It probably makes sense to save your authenitcation (github username and password) now, but you don't need to. 
* Click Next
* Uncheck all branches, except the 'master' branch (since it's your fork, the rest don't matter). 
* Click Next
* Choose the path where where you want to checkout your clone. Decide if you
	want to change the name of the 'Remote Name' (you probably don't need to).
	* Make sure the "clone submodules" checkbox is checked
* Click Finish
* Once it finishes cloning your fork:
	* Navigate that tree, and find the

		> Working Directory -> backend 

		directory. 

	* Right click, and choose the

		> Import projects

		menu item.

	* This will present you with an import wizard, choose the

		> Import as a general project

		radio button. Choose 'next', and give your project a name.

	* This should then create an eclipse project. Right click on it, and choose

		> Team -> Switch to... -> New Branch

		Ensure that "Source ref" is set to 

			> refs/heads/master

		and that the "Checkout new branch" check box is checked.

	* Name your branch

		> lastName_description_of_feature

		and then go ahead and finish. 

You should now be setup properly to edit the server backed in Eclipse.

# Web

# Mobile

