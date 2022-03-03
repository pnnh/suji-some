//
// Created by ubuntu on 2/13/22.
//

#include "pq.h"
#include <iostream>
#include <pqxx/pqxx>
#include <chrono>
#include "src/services/config/aws/appconfig.h"
#include "src/utils/datetime.h"

std::vector<ArticleModel> selectArticles() {
    std::vector<ArticleModel> articlesList;
    auto pqDsn = GetConfigItem("DSN");
    std::cout << "pqDsn is: " << pqDsn << std::endl;
    try {
        pqxx::connection conn(pqDsn);
        if (conn.is_open()) {
            std::cout << "Opened database successfully: " << conn.dbname() << std::endl;
            const char *sqlText = "select pk, title, body, create_time, update_time, creator, "
                                  "keywords, description from articles order by update_time desc limit 100;";
            pqxx::nontransaction N(conn);
            pqxx::result R(N.exec(sqlText));

            for (pqxx::result::const_iterator itr = R.begin(); itr != R.end(); ++itr) {
                std::cout << "Pk = " << itr[0].as<std::string>() << std::endl;
                std::cout << "Title = " << itr[1].as<std::string>() << std::endl;
                auto model = ArticleModel{
                        .pk=itr[0].as<std::string>(),
                        .title=itr[1].as<std::string>(),
                        .body = itr[2].as<std::string>(),
                        .create_time = makeTimePoint(itr[3].as<std::string>()),
                        .update_time = makeTimePoint(itr[4].as<std::string>()),
                        .creator = itr[5].as<std::string>()};
                if (!itr[6].is_null()) {
                    model.keywords = itr[6].as<std::string>();
                }
                if (!itr[7].is_null()) {
                    model.description = itr[7].as<std::string>();
                }

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
    return articlesList;
}
