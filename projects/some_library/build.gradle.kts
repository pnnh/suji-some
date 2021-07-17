plugins {
    application
    kotlin("multiplatform") version "1.5.20"
    kotlin("plugin.serialization") version "1.5.20"
}

group = "xyz.sfx"
version = "1.0"

repositories {
    jcenter()
    mavenCentral()
    maven { url = uri("https://maven.pkg.jetbrains.space/kotlin/p/kotlin/kotlin-js-wrappers") }
    maven { url = uri("https://maven.pkg.jetbrains.space/public/p/kotlinx-html/maven") }
}

application {
    mainClass.set("xyz.sfx.Main")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=true")
}

kotlin {
    jvm {
        compilations.all {
            kotlinOptions.jvmTarget = "11"
        }
    }
    js(LEGACY) {
        binaries.executable()
        browser {
            commonWebpackConfig {
                cssSupport.enabled = true
            }
        }
    }
    val hostOs = System.getProperty("os.name")
    val nativeTarget = when (hostOs) {
        "Mac OS X" -> macosX64("native")
        "Linux" -> linuxX64("native")
        else -> throw GradleException("Host OS is not supported in Kotlin/Native.")
    }
    nativeTarget.apply {
        binaries {
            sharedLib {
                baseName = "some"
            }
        }
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.2.1")
            }
        }
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
        val jvmMain by getting {
            dependencies {
                implementation("io.ktor:ktor-server-core:1.5.4")
                implementation("io.ktor:ktor-server-cio:1.5.4")
                implementation("io.ktor:ktor-serialization:1.5.4")
                implementation("io.ktor:ktor-html-builder:1.5.4")
                implementation("org.jetbrains.kotlinx:kotlinx-html-jvm:0.7.3")
                implementation("org.jetbrains:kotlin-css-jvm:1.0.0-pre.129-kotlin-1.4.20")
                implementation("ch.qos.logback:logback-classic:1.2.3")
                implementation("org.jetbrains.exposed:exposed-core:0.31.1")
                implementation("org.jetbrains.exposed:exposed-dao:0.31.1")
                implementation("org.jetbrains.exposed:exposed-jdbc:0.31.1")
                implementation("org.jetbrains.exposed:exposed-jodatime:0.31.1")
                implementation("org.postgresql:postgresql:42.1.4")
                implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.12.4")
            }
        }
        val jvmTest by getting
        val jsMain by getting {
            dependencies {
            }
        }
        val jsTest by getting
        val nativeMain by getting
        val nativeTest by getting
    }
}