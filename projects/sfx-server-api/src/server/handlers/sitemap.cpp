//
// Created by ubuntu on 2/16/22.
//

#include "sitemap.h"
#include <iostream>
#include <fstream>
#include "src/utils/mime.h"
#include "src/services/database/postgresql/pq.h"
#include "src/utils/datetime.h"
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/xml_parser.hpp>
#include <boost/typeof/typeof.hpp>
#include <boost/iostreams/stream.hpp>
#include <boost/iostreams/stream_buffer.hpp>

void HandleSitemap(boost::beast::http::response<boost::beast::http::dynamic_body> &response) {
    response.set(boost::beast::http::field::content_type, "text/xml");
//    std::ifstream infile;
//    infile.open("static/index.html");
//
//    std::string path = "static/index.html";
//
//    std::string full_path = "static/index.html";
//
//    response.result(boost::beast::http::status::ok);
//    response.keep_alive(false);
//    response.set(boost::beast::http::field::server, "Beast");
//    response.set(boost::beast::http::field::content_type, mime_type(std::string(full_path)));
//
//    boost::beast::ostream(response.body()) << infile.rdbuf();
    boost::property_tree::ptree pt;

    pt.put("debug.filename", "cccc");  // 写入xml节点，通过点分割层级
    pt.put("debug.level", "wwww");

    auto articlesList = selectArticles();
    for (const auto &article: articlesList) {
        std::cout << "article is " << article.pk << "|" << article.title << std::endl;
        pt.put("debug.pk", article.pk);
        pt.put("debug.title", article.title);
        pt.put("debug.update_time", formatTime(article.update_time));
    }
    std::ostringstream oss;
    boost::property_tree::write_xml(oss, pt);
    std::cout << "xml is " << oss.str() << std::endl;
    boost::beast::ostream(response.body()) << oss.str();
}