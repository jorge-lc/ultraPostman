# ultraPostman
ultraPostman is a API tool designed for testing purpose of the https://gorest.co.in/public/v2/users API service

## Installation
To use ultraPostman, follow these steps:

1. Clone the repository:
```
git clone https://github.com/jorge-lc/ultraPostman.git
```
2. Install the required dependencies:
```
cd ultraPostman
npm install
```
3. Run the testing collection:
```
npm run gorestCollection
```
## Usage
Once you have ultraPostman installed, follow these steps to start testing APIs:

1. Test Scripts: To automate testing procedures, ultraPostman supports the execution of tests using collections and environment files.

* Inside the Tests folder, you'll find pre-defined tests for the requests in the collection.
* To execute the tests that are already included, run the following command:
```
npm run gorestCollection
```
This will execute the testing collection that is inside Ultra.postman_collection.json file

2. Environment Variables: Inside the Environment folder, you'll find an environment file containing predefined environment variables. Modify these variables as needed for your testing environment.
* You can access the environment variables in your requests by using the syntax {{variable_name}}.
* Update the values in the environment file to match your specific requirements.
* Right now the environment file is UltraPostman.postman_environment.json. This file contains all the necessary variables in order to execute the collection inside Tests folder
## Testing approach
I decide to go over /users API, in this case I tried to cover all the diferent scenario that I could think, like User Creation, Update and Delete. Also I included a couple of tests to validate how the API handle malformed information.