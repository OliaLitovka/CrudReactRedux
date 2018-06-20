module.exports = (res, sql, callback) => {
	res.locals.connection.query(sql, function(error, results, fields){
      if(error) {
        res.status(500).json(error);
      }
      else {
      	callback(results);
      }
    });	
}

