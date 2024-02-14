const inquire = require('inquirer')
const prompt = inquire.createPromptModule()
const mysql = require('Mysql')

const myConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
})
 
myConnection.connect((err)=>{
    if (err) throw err
    console.log("Connected to the database successfully")
    mainMenu()
})

const mainMenuQuestion = [
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ];

  const departmentQuestion = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:'
      }
  ]
  
  const employeeAddQuestions =[
        {
          type: 'input',
          name: 'roleName',
          message: 'Enter the name of the role:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for this role:',
          // Ensure the input is a number
          validate: input => {
            if (/^\d+$/.test(input)) return true;
            return 'Please enter a valid number for salary.';
          }
        },
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select the department for this role:',
          //Tod get departments from db
          choices: departments.map(dept => ({ name: dept.name, value: dept.id })),
        }
  ]

  const employeeUpdateQuestion = [
    {
        type: 'list',
        name: 'employees',
        //ToDo get the employees from db
        choices: [] 
    },
    {
        type: 'list',
        name: 'newRole',
        message: 'Enter a new role',
        choices: []
    }
  ]

  function mainMenu() {
    inquirer.prompt(mainMenuQuestion).then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          // Function to view all departments
          break;
        case 'View all roles':
          // Function to view all roles
          break;
        case 'View all employees':
          // Function to view all employees
          break;
        case 'Add a department':
          // Function to add a department
          break;
        case 'Add a role':
          // Function to add a role
          break;
        case 'Add an employee':
          // Function to add an employee
          break;
        case 'Update an employee role':
          // Function to update an employee's role
          break;
        case 'Exit':
          // Exit the application
          console.log('Goodbye!');
          process.exit();
      }
    });
  }


  // Start the application
  mainMenu();
