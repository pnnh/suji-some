package server

import com.typesafe.config.ConfigFactory
import io.ktor.config.*
import io.ktor.server.engine.*
import io.ktor.server.cio.*
import org.jetbrains.exposed.sql.Database
import org.slf4j.LoggerFactory
import server.modules.*
import utils.AESCrypt

fun main() {
    val key = "dae[8<Fj1Y8%RNk}SFuG_Q/.!5-%@?Lp"
    val aesData = AESCrypt.encrypt("E3rTwpKAEAA", key)
    println("aesData ${aesData}")
    val decData = AESCrypt.decrypt("Jn9mNcn4cB84dZTuBJJbIjN6QsLwml1VsK4pdrHVOF8=", key)
    println("aesData==== ${decData}")
    return
    val dsn = "jdbc:postgresql://localhost/sfxdb?user=postgres&password=example&ssl=false"
    Database.connect(dsn, driver = "org.postgresql.Driver")

    embeddedServer(CIO, environment = applicationEngineEnvironment {
        log = LoggerFactory.getLogger("ktor.application")
        config = HoconApplicationConfig(ConfigFactory.load())
        module {
            configureRouting()
        }
        connector {
            port = 8080
            host = "0.0.0.0"
        }
    }) {
    }.start(wait = true)
}
