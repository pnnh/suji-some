package server.modules

import io.ktor.application.*
import io.ktor.util.*
import org.jetbrains.exposed.sql.Database

fun Application.configureDatabase() {
    val dsnOrNull = environment.config.propertyOrNull("ktor.dsn")?.getString()
    install(CustomFeature) {
        dsn = dsnOrNull ?: ""
    }

}

class CustomFeature(configuration: Configuration) {
    val dsn = configuration.dsn

    class Configuration {
        var dsn = ""
    }

    // Implements ApplicationFeature as a companion object.
    companion object Feature : ApplicationFeature<ApplicationCallPipeline, CustomFeature.Configuration, CustomFeature> {
        // Creates a unique key for the feature.
        override val key = AttributeKey<CustomFeature>("CustomFeature")

        // Code to execute when installing the plugin.
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomFeature {

            val configuration = CustomFeature.Configuration().apply(configure)

            val feature = CustomFeature(configuration)
            //val dsn = "jdbc:postgresql://localhost/sfxdb?user=postgres&password=example&ssl=false"
            Database.connect(feature.dsn, driver = "org.postgresql.Driver")

            return feature
        }
    }
}