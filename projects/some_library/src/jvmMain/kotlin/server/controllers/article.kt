package server.controllers

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import kotlinx.html.*
import kotlinx.html.stream.appendHTML
import kotlinx.serialization.encodeToString
import slate.*
import kotlinx.serialization.json.Json


fun Application.configureArticleController() {
    routing {
        get("/blog/article/{pk}") {
            val pk = call.parameters["pk"]
            println("pk is $pk")
            val editorString = """
            {
	"children": [{"name":"paragraph","children":[{"name":"text","text":"a"}]},{"name":"header","text":"b","header":1},{"name":"code-block","children":[{"name":"code","text":"<h1>hello</h1>console.log(\"hello\");"}],"language":"js"},{"name":"paragraph","children":[{"name":"text","text":"c"}]}]
}
        """.trimIndent()
            val editor = decodeEditorFromString(editorString)
            val text = buildEditor(editor)
            val testJson = Json.encodeToString(editor)
            println("text $testJson")
            call.respondText(ContentType.Text.Html) { text }
        }
    }
}

fun buildEditor(editor: SFEditor): String {
    val builder = StringBuilder()
    builder.appendHTML().html {
        body {
            div {
                a("https://kotlinlang.org") {
                    target = ATarget.blank
                    +"Main site"
                }
            }
            div {
                editor.children.forEach { it ->
                    buildNode(it, builder)()
                }
            }
            div {
                getDiv1()()
                getDiv2()
            }
        }
    }
    return builder.toString()
}

fun getDiv1(): DIV.() -> Unit {
    return {
        p {
            +"first try 1"
        }
    }
}

val getDiv2: DIV.() -> Unit
    get() = {
        p {
            +"first try 2"
        }
    }


fun buildNode(node: SFNode, builder: StringBuilder): DIV.() -> Unit {
    return when (node.name) {
        "paragraph" -> buildParagraph(node as SFParagraph, builder)
        "header" -> buildHeader(node as SFHeader, builder)
        "code-block" -> buildCodeBlock(node as SFCodeBlock, builder)
        else -> throw IllegalArgumentException("未知节点 ${node.name}")
    }
}

fun buildParagraph(node: SFParagraph, builder: StringBuilder): DIV.() -> Unit {
    return {
        p {
            node.children.forEach { it ->
                when (it.name) {
                    "text" -> buildText(it as SFText, builder)()
                    else -> throw IllegalArgumentException()
                }
            }
        }
    }
}

fun buildHeader(node: SFHeader, builder: StringBuilder): DIV.() -> Unit {
    return {
        when (node.header) {
            1 -> h1 {
                +node.text
            }
            2 -> h2 {
                +node.text
            }
            3 -> h3 {
                +node.text
            }
            4 -> h4 {
                +node.text
            }
            5 -> h5 {
                +node.text
            }
            6 -> h6 {
                +node.text
            }
            else -> throw IllegalArgumentException("无效标题 ${node.header}")
        }
    }
}

fun buildCodeBlock(node: SFCodeBlock, builder: StringBuilder): DIV.() -> Unit {
    return {
        div("code-block") {
            attributes["a"] = "b"
            node.children.forEach { it ->
                when (it.name) {
                    "code" -> buildCode(it as SFCode, builder)()
                    else -> throw IllegalArgumentException()
                }
            }
        }
    }
}

fun buildText(node: SFText, builder: StringBuilder): P.() -> Unit {
    return {
        span {
            +node.text
        }
    }
}

fun buildCode(node: SFCode, builder: StringBuilder): DIV.() -> Unit {
    return {
        span {
            +node.text
        }
    }
}