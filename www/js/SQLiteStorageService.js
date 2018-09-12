SQLiteStorageService = function () {
    var service = {};
    var db = window.sqlitePlugin ?
        window.sqlitePlugin.openDatabase({name: "demo.toptal", location: "default"}) :
        window.openDatabase("demo.toptal", "1.0", "DB para FactAV", 5000000);

    service.initialize = function() {

        var deferred = $.Deferred();
        db.transaction(function(tx) {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS projects ' +
                '(id integer primary key, name text, company text, description text)'
            ,[], function(tx, res) {
                // tx.executeSql('DELETE FROM projects', [], function(tx, res) {
                    deferred.resolve(service);
                // }, function(tx, res) {
                    // deferred.reject('Error initializing database');
                // });
            }, function(tx, res) {
                deferred.reject('Error initializing database');
            });
        });
        return deferred.promise();
    }

    service.getProjects = function() {
    	var deferred = $.Deferred();

        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM projects', [], function(tx, res) {

                var projects = [];
                console.log(res.rows.length);
                for(var i = 0; i < res.rows.length; i++) {
                    var project = { name: res.rows.item(i).name, company: res.rows.item(i).company, description: res.rows.item(i).description };
                    projects.push(project);
                }
                deferred.resolve(projects);

            }, function(e) {
                deferred.reject(e);
            });
        });
        return deferred.promise();
    }

    service.addProject = function(name, company, description) {
        var deferred = $.Deferred();
        console.log(db);

        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO projects (name, company, description) VALUES (?,?,?)', [name, company, description], function(tx, res) {
                deferred.resolve();
            }, function(e) {
                deferred.reject(e);
            });
        });

        return deferred.promise();
    }


    return service.initialize();
}
