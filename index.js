const inquirer = require('inquirer');
const mysql = require('mysql2');
const path = require('path')
const fs = require('fs')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db',
    multipleStatements: true
});

//Function to read sql files and execute them
const executeSQL = (filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8')
  db.query(sql, (error, results)=>{
    if (error){
      console.error('Error exexcuting sql files', error)
      return
    }
    // console.log(`${filePath} executed successfully`)
  })
}
const schemaFilePath = path.join(__dirname, 'db', 'schema.sql')
const seedFilePath = path.join(__dirname, 'db', 'seed.sql')

db.connect(err =>{
  if(err){
    console.error('Error connecting to the database', err)
    return
  }
  console.log('Connected to the database')
  executeSQL(schemaFilePath)
  executeSQL(seedFilePath)
})

async function fetchDepartments() {
    try {
        const [rows, fields] = await db.promise().query('SELECT name FROM departments');
        return rows.map(department => department.name);
    } catch (error) {
        console.error('Error fetching departments:', error);
        return [];
    }
}

async function fetchRoles() {
  try {
      const [rows] = await db.promise().query('SELECT id, title FROM roles');
      return rows.map(row => ({ name: row.title, value: row.id })); // Correctly map to objects
  } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
  }
}

async function fetchEmployees() {
    try {
        const [rows] = await db.promise().query('SELECT id, first_name, last_name FROM employees');
        return rows.map(row => ({ name: row.first_name, value: row.id })); // Correctly map to objects
    } catch (error) {
        console.error('Error fetching Employees:', error);
        console.log( )
        return [];
    }
  }

async function getDepartmentId(departmentName) {
    const [rows] = await db.promise().query('SELECT id FROM departments WHERE name = ?', [departmentName]);
    if (rows.length > 0) {
      return rows[0].id; // Assuming 'name' is unique and there's only one row
    } else {
      return null; // Or handle the case where the department does not exist
    }
  }

  async function getRoleId(roleName) {
    const [rows] = await db.promise().query('SELECT id FROM roles WHERE title = ?', [roleName]);
    if (rows.length > 0) {
      return rows[0].id; // Assuming 'name' is unique and there's only one row
    } else {
      return null; // Or handle the case where the department does not exist
    }
  }

async function addEmployee() {
  const roles = await fetchRoles(); // Fetch roles before asking questions
  const questions = [
      ...addEmployeeQuestions,
      {
          type: "list",
          name: "role_id",
          message: "Select the role for this employee:",
          choices: roles // Use fetched roles directly
      }
  ];

  inquirer.prompt(questions).then((response) => {
      const newEmployee = {
          first_name: response.first_name,
          last_name: response.last_name,
          role_id: response.role_id // Directly use the selected role ID
      };
      
      db.query('INSERT INTO employees SET ?', newEmployee, (error, results) => {
          if (error) {
              console.error('Error adding employee:', error);
          } else {
              console.log('Employee added successfully');
              mainMenu();
          }
      });
  }).catch(error => {
      console.error('Error in addEmployee:', error);
  });
}

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

const addDepartmentQuestions = [
    {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
    }
];

const addRoleQuestions = [
    {
        type: 'input',
        name: 'title',
        message: 'Enter name of the new role:'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Enter a salary for this role:'
    }
];

const addEmployeeQuestions = [
    {
        type: 'input',
        name: 'first_name',
        message: 'Enter the new employee\'s first name:'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'Enter the new employee\'s last name:'
    }
];

const updateEmployeeRoleQuestion = [

]


function mainMenu() {
    inquirer.prompt(mainMenuQuestion).then(async (response) => {
        const table = response.action.split(" ").pop();
        const action = response.action.split(" ")[0];
        console.log(table, action)

        switch (action) {
            case 'View':
                db.query(`SELECT * FROM ${table}`, (error, results, fields) => {
                    if (error) {
                        console.error(`Error viewing ${table}:`, error);
                    } else {
                        console.log(`Viewing all ${table}...`);
                        console.log(results);
                        mainMenu();
                    }
                });
                break;
            case 'Add':
                switch (table) {
                    case 'employee':
                        try {
                            const roles = await fetchRoles();
                            // console.log(roles)
                            addEmployeeQuestions.push({
                                type: "list",
                                name: "role_name",
                                message: "Select the role for this employee:",
                                choices: roles
                            });
                            inquirer.prompt(addEmployeeQuestions).then((response) => {
                                getRoleId(response.role_name).then(role_id =>{
                                    // console.log(response.role_name, role_id)
                                    const newEmployee = {
                                        first_name: response.first_name,
                                        last_name: response.last_name,
                                        role_id: response.role_name // Use the retrieved role_id
                                    };                            
                                  db.query('INSERT INTO employees SET ?', newEmployee, (error, results, fields) => {
                                      if (error) {
                                          console.error('Error adding employee:', error);
                                      } else {
                                          console.log('Employee added successfully');
                                      }
                                      mainMenu();
                                    });
                                })
                            });
                        } catch (error) {
                            console.error('Error fetching role:', error);
                            mainMenu();
                        }
                        break;
                    case 'role':
                        try {
                            const departments = await fetchDepartments();
                            console.log(departments)
                            addRoleQuestions.push({
                                type: "list",
                                name: "department_name",
                                message: "Select department for this role:",
                                choices: departments
                            });
                       
                        inquirer.prompt(addRoleQuestions).then((response) => {
                            getDepartmentId(response.department_name).then(department_id =>{
                                const newRole = {
                                    title: response.title,
                                    salary: response.salary,
                                    department_id: department_id //ToDo add department ID
                                }
                                
                                db.query('INSERT INTO roles SET ?', newRole, (error, results, fields) => {
                                    if (error) {
                                        console.error('Error adding role:', error);
                                    } else {
                                        console.log('Role added successfully');
                                    }
                                    mainMenu();
                                });
                            })    
                        });
                    } catch {
                        console.error('Error fetching departments:', error);
                        mainMenu();
                    }
                        break;
                    case 'department':
                        inquirer.prompt(addDepartmentQuestions).then((response) => {
                            db.query('INSERT INTO departments SET ?', response, (error, results, fields) => {
                                if (error) {
                                    console.error('Error adding department:', error);
                                } else {
                                    console.log('Department added successfully');
                                }
                                mainMenu();
                            });
                        });
                        break;
                }
                break;
            case 'Update':
                // Handle Update case
                try{
                    const employees = await fetchEmployees();
                    const roles = await fetchRoles();
                    updateEmployeeRoleQuestion.push(
                        {
                            type: "list",
                            name: 'employee_id',
                            message: "Select Employee to udpdate",
                            choices: employees
                        },
                        {
                            type: "list",
                            name: "new_role_id",
                            message: "Select New role for employee",
                            choices: roles
                        }
                    )

    
                inquirer.prompt(updateEmployeeRoleQuestion).then((response) => {
                    const {employee_id, new_role_id} = response
                    console.log(employee_id, new_role_id)
                    db.query("UPDATE employees SET role_id = ? WHERE id = ?", [new_role_id, employee_id], (error, results) => {
                        if (error) {
                            console.error('Error updating employee:', error);
                        } else {
                            console.log('Employee updated successfully');
                        }
                        mainMenu();
                    })
                })



                }catch(error){
                    console.error('Error Updating Employee',error)
                }
                break;
            case 'Exit':
                process.exit(0);
        }
    });
}

function init() {
    mainMenu();
}

init();
