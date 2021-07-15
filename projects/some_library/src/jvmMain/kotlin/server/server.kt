package server

import com.typesafe.config.ConfigFactory
import io.ktor.config.*
import io.ktor.server.engine.*
import io.ktor.server.cio.*
import org.jetbrains.exposed.sql.Database
import org.slf4j.LoggerFactory
import server.controllers.configureArticleController
import server.controllers.configureQuestController
import server.modules.*

fun main() {
    embeddedServer(CIO, environment = applicationEngineEnvironment {
        log = LoggerFactory.getLogger("ktor.application")
        config = HoconApplicationConfig(ConfigFactory.load())
        module {
            configurePlugins()
            configureRouting()
            configureDatabase()
            configureQuestController()
            configureArticleController()
        }
        connector {
            port = 8080
            host = "0.0.0.0"
        }
    }) {
    }.start(wait = true)
}
