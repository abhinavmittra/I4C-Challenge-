This repository contains all the code for the website we came up with as part of the Innovation4Community Challenge at Cisco Systems.
The Challenge requires a platform that connects donors to donate their used items with NGO’s directly thereby enabling resource sharing.
We came up with a dashboard to address the forementioned challenge requirement.

Documentation: 
Summary: has all the key features, the way we offer solutions to each of the requirements asked by the NGO U&I and also information about our application usage.
Endpoints: has all information for all our endpoints in Flask
Elastic: has all the db information i.e the way we designed our db and the different indexes we have.
categoriesData: has all the information related to categories and their subcategories and the information about requestLimit imposed for each of them as of now. 
applicationDemo: It has the recorded demo of our application showcasing all the use cases we try to solve



Tools used:
Angular Framework 
Flask
Elastic Search



Steps to run it:

FRONT END: (ANGULAR 10.0.8)
Step1: Install npm (node package manager) 
link: https://nodejs.org/en/download/
Step2: navigate to the directory of the project folder and open a terminal
type "npm install @angular/cli"
This will install angular cli on your machine, you can either install the latest version or go ahead with the version we used.
Step3: navigate to "Donate-Cart/angular/donate-cart-ui" and open a terminal
type "ng serve" and your front end will be running on localhost:4200


BACKEND (FLASK):
Step1: install python
link: https://www.python.org/downloads/
Step2: navigate to Donate-Cart/src and open a terminal
type "pip install -r requirements.txt"
Step3: type "flask run"
This will start running your backend on 127.0.0.1:5000 which will serve all the requests from front end.

USAGE:
Open a web browser and go to localhost:4200 where you will be able to use the application
