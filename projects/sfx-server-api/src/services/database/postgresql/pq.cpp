//
// Created by ubuntu on 2/13/22.
//

#include "pq.h"
#include <iostream>
#include <pqxx/pqxx>
#include "src/services/config/aws/appconfig.h"

std::vector<ArticleModel> selectArticles() {
    std::vector<ArticleModel> articlesList;
    auto pqDsn = GetConfigItem("DSN");
    std::cout << "pqDsn is: " << pqDsn << std::endl;
    try {
        pqxx::connection conn(pqDsn);
        if (conn.is_open()) {
            std::cout << "Opened database successfully: " << conn.dbname() << std::endl;
            const char *sqlText = "select pk, title, body, create_time, update_time, creator, "
                                  "keywords, description from articles;";
            pqxx::nontransaction N(conn);
            pqxx::result R(N.exec(sqlText));

            for (pqxx::result::const_iterator itr = R.begin(); itr != R.end(); ++itr) {
                std::cout << "Pk = " << itr[0].as<std::string>() << std::endl;
                std::cout << "Title = " << itr[1].as<std::string>() << std::endl;
                auto model = ArticleModel{.pk=itr[0].as<std::string>(), .title=itr[1].as<std::string>()};
                articlesList.push_back(model);
            }
            std::cout << "Operation done successfully" << std::endl;
        } else {
            std::cout << "Can't open database" << std::endl;
            return articlesList;
        }
        conn.disconnect();
    } catch (const std::exception &e) {
        std::cerr << e.what() << std::endl;
        return articlesList;
    }
}
