
# Nive - Notepad

A simple cloud notepad to manage personal notes. The notepad is a simple one
page javascript application based on jQuery and the cloud framework nive.io.

Backend functionality (storage, user management and authentication) is
connected through web apis provided by the DataStorage and UserAccount
components.

A ready to use installation is running as [notepad.nive.io](http://notepad.nive.io)

If you would like to setup your own notepad or use it a as starting to try
out the platform follow the steps described in the next section.

## Nive backend configuration

The backend for the notepad requires the following three components to be set
up and configured:

1) DataStorage: name `notes`, database to store notes 
  - Keys + Validators: key=`note`, type=`text`, minimum size=`1`, maximum size=``
  - Settings: key scope=`multiple values per key`
  - Security: create item=`authenticated`, *all other functions*=`owner`

2) FileHosting: default settings

3) UserAccounts: default settings 

4) Domain settings: Administration -> Default urls: Set Default page = `/app/index.html`

## Commandline script to create a zip file

Here is a simple command line command to turn the `app` directory only into a 
zip file :

    git archive --format zip --output ../app.zip master:app

## License

Released under the MIT-License. See http://jquery.org/license 

(c) 2013-2014 Nive GmbH - www.nive.co  
