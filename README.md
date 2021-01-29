## Rule Validation API
This project is a simple rule-validation API.

## Requirements
The rule validation route [HTTP POST "/validate-rule"] should accept JSON data containing a rule and data field to validate the rule against.
  * The rule and data fields are required.
  * The rule field should be a valid JSON object.
  * The rule object should contain a field key.
  * The rule object should contain a condition key with acceptable values of "eq|neq|gt|gte|contains".
  * The rule object should contain a condition_value key.
  * The data field can either be a valid JSON object or a valid array or a string.
  
## Technologies
Project created with:
* Express : Server-side framework
* Joi : Data validation library
* Jest : Testing framework

## Setup
To run this project, clone the repository to access all files.
- Run ``` npm install ``` to install dependencies. 
- Run ```npm test``` for testing.
- Run ```npm start``` to start the server.
