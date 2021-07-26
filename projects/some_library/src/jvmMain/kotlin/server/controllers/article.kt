package server.controllers

import io.ktor.application.*
import io.ktor.html.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import kotlinx.html.*
import kotlinx.serialization.encodeToString
import slate.*
import kotlinx.serialization.json.Json
import server.db.queryArticle

val Application.envKind get() = environment.config.property("ktor.environment").getString()
val Application.isDebug get() = envKind == "debug"
val Application.resHost get() = if (isDebug) "http://127.0.0.1:3000" else "https://res.sfx.xyz"

fun Application.jsLink(resUrl: String, proResUrl: String): String {
    if (isDebug) {
        return "$resHost$resUrl"
    }
    return "$resHost$proResUrl"
}

fun Application.cssLink(resUrl: String, proResUrl: String): String {
    if (isDebug) {
        return "$resHost$resUrl"
    }
    return "$resHost$proResUrl"
}

fun Application.configureArticleController() {
    routing {
        get("/blog/article/{pk}") {
            val pk = call.parameters["pk"]
            println("pk is $pk")
            var editorString = """
            {
	"children": [{"name":"paragraph","children":[{"name":"text","text":"a"}]},{"name":"header","text":"b","header":1},{"name":"code-block","children":[{"name":"code","text":"<h1>hello</h1>console.log(\"hello\");"}],"language":"js"},{"name":"paragraph","children":[{"name":"text","text":"c"}]}]
}
        """.trimIndent()

            if (pk != null) {
                val article = queryArticle(pk)
                if (article != null) {
                    editorString = article.body
                    val editor = decodeEditorFromString(editorString)

                    call.respondHtml() {
                        head {
                            meta(charset = "utf-8")
                            meta(
                                "viewport",
                                "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
                            )
                            meta("render", "webkit")
                            meta() {
                                httpEquiv = "X-UA-Compatible"
                                content = "IE=edge,chrome=1"
                            }
                            link("https://res.sfx.xyz/favicon.ico", "icon", "image/x-icon")
                            link("https://res.sfx.xyz/favicon.ico", "shortcut icon", "image/x-icon")
                            title("泛函")
                            link(cssLink("/src/pages/article.scss", "/article.css"), "stylesheet", "text/css")
                        }
                        body {
                            div("ms-Grid") {
                                dir = Dir.ltr
                                div("ms-Grid-row header") {
                                    div("ms-Grid-col ms-sm0 ms-xl2")
                                    div("ms-Grid-col ms-sm12 ms-xl8") {
                                        div("ms-Grid-row header-row") {
                                            div("ms-Grid-col ms-x18 header-left") {
                                                div("logo") {
                                                    a("/", "") {
                                                        title = "首页"
                                                        +"sfx.xyz"
                                                    }
                                                }
                                                div("menu") {
                                                    a("/", "", "link") {
                                                        title = "文章"
                                                        +"文章"
                                                    }
                                                    a("/", "", "link") {
                                                        title = "工具"
                                                        +"工具"
                                                    }
                                                    a("/article/edit/${article.pk}", "", "link") {
                                                        title = "修改文章"
                                                        +"修改文章"
                                                    }
                                                }
                                            }
                                            div("ms-Grid-col ms-xl4 header-right") {
                                                div { id = "actions" }
                                            }
                                        }
                                    }
                                    div("ms-Grid-col ms-sm0 ms-xl2")
                                }
                            }
                            div("ms-Grid-row") {
                                dir = Dir.ltr
                                div("ms-Grid-col ms-xl2")
                                div("ms-Grid-col ms-xl8") {
                                    div() {
                                        editor.children.forEach { it ->
                                            buildNode(it)()
                                        }
                                    }
                                }
                                div("ms-Grid-col ms-xl2")
                            }
                            script("module", jsLink("/src/pages/article.tsx", "/article.js")) {}
                        }
                    }
                }
            } else {
                call.respondText("文章不存在")
            }
        }
    }
}

fun buildNode(node: SFNode): DIV.() -> Unit {
    return when (node.name) {
        "paragraph" -> buildParagraph(node as SFParagraph)
        "header" -> buildHeader(node as SFHeader)
        "code-block" -> buildCodeBlock(node as SFCodeBlock)
        else -> throw IllegalArgumentException("未知节点 ${node.name}")
    }
}

fun buildParagraph(node: SFParagraph): DIV.() -> Unit {
    return {
        p {
            node.children.forEach { it ->
                when (it.name) {
                    "text" -> buildText(it as SFText)()
                    else -> throw IllegalArgumentException()
                }
            }
        }
    }
}

fun buildHeader(node: SFHeader): DIV.() -> Unit {
    val textNode = node.children.first() as SFText
    return {
        when (node.header) {
            1 -> h1 {
                +textNode.text
            }
            2 -> h2 {
                +textNode.text
            }
            3 -> h3 {
                +textNode.text
            }
            4 -> h4 {
                +textNode.text
            }
            5 -> h5 {
                +textNode.text
            }
            6 -> h6 {
                +textNode.text
            }
            else -> throw IllegalArgumentException("无效标题 ${node.header}")
        }
    }
}

fun buildCodeBlock(node: SFCodeBlock): DIV.() -> Unit {
    return {
        pre("code-block") {
            attributes["a"] = "b"
            node.children.forEach { it ->
                when (it.name) {
                    "code" -> buildCode(it as SFCode)()
                    else -> throw IllegalArgumentException("未知类型: ${it.name}")
                }
            }
        }
    }
}

fun buildText(node: SFText): P.() -> Unit {
    return {
        span {
            +node.text
        }
    }
}

fun buildCode(node: SFCode): PRE.() -> Unit {
    return {
        span {
            +node.text
        }
    }
}