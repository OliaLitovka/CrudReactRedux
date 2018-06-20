var config = {
	database: {
		host:	  'localhost', 	// database host
		user: 	  'root', 		// your database username
		password: 'root', 		// your database password
		port: 	  3306, 		// default MySQL port
		db: 	  'crudreact' 		// your database name
	},
	server: {
		host: '127.0.0.1',
		port: '3001'
	},
	jwtSecret: 'secret'
}

module.exports = config
