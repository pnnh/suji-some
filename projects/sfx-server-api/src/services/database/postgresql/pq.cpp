//
// Created by ubuntu on 2/13/22.
//

#include "pq.h"
#include <iostream>
#include <pqxx/pqxx>
#include "src/services/config/aws/appconfig.h"

void runPqxxTest() {

    auto pqDsn = GetConfigItem("DSN");
    std::cout << "pqDsn is: " << pqDsn << std::endl;
    try {
        pqxx::connection conn(pqDsn);
        if (conn.is_open()) {
            std::cout << "Opened database successfully: " << conn.dbname() << std::endl;
            const char *sqlText = "select * from accounts;";
            pqxx::nontransaction N(conn);
            pqxx::result R(N.exec(sqlText));

            for (pqxx::result::const_iterator itr = R.begin(); itr != R.end(); ++itr) {
                std::cout << "Pk = " << itr[0].as<std::string>() << std::endl;
                std::cout << "UName = " << itr[1].as<std::string>() << std::endl;
            }
            std::cout << "Operation done successfully" << std::endl;
        } else {
            std::cout << "Can't open database" << std::endl;
            return;
        }
        conn.disconnect();
    } catch (const std::exception &e) {
        std::cerr << e.what() << std::endl;
        return;
    }
}