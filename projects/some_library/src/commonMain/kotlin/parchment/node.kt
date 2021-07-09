package parchment

import kotlinx.serialization.json.*
import utils.StringUtils

expect fun htmlEncode(text:String): String

open class Node(
    var name: String = "",
    val children: ArrayList<Node> = arrayListOf<Node>()
) {
    internal open fun valueToJsonObject(): JsonObject {
        TODO("Not yet implemented")
    }
    internal open fun valueToHtmlString(): String {
        TODO("Not yet implemented")
    }
}

private val defaultDeltaSerializer = DeltaSerializer()
private val defaultNodeSerializer = NodeSerializer()

fun deltaToJsonString(packet: String): String {
    val node = defaultDeltaSerializer.parseToNode(packet)
    return defaultNodeSerializer.encodeToJsonString(node)
}

fun deltaToHtmlString(packet: String): String {
    val node = defaultDeltaSerializer.parseToNode(packet)
    return defaultNodeSerializer.encodeToHtmlString(node)
}

class NodeSerializer() {
    private val json = Json {
        isLenient = true
        prettyPrint = true
        ignoreUnknownKeys = true
        coerceInputValues = true
    }
    fun encodeToJsonString(node: Node): String {
        val jsonObject = encodeToJsonObject(node)
        val a = json.encodeToString<JsonObject>(JsonObject.serializer(), jsonObject)
        return a
    }
    fun encodeToHtmlString(node: Node): String {
        val tagString = node.valueToHtmlString()
        return tagString
    }

    private fun encodeToJsonObject(node: Node): JsonObject {
        val map = mutableMapOf<String, JsonElement>()
        val jsonObject = JsonObject(content = map)
        map["name"] = JsonPrimitive(node.name)
        map["value"] = node.valueToJsonObject()
        val list = arrayListOf<JsonObject>()
        for(b in node.children) {
            val subMap = b.valueToJsonObject()
            list.add(subMap)
        }
        map["children"] = JsonArray(list)
        return jsonObject
    }
}

class HeaderNode(private val text: String, private val header: Int = 0): Node(name = "header") {
    override fun valueToJsonObject(): JsonObject {
        val map = mutableMapOf<String, JsonElement>()
        val jsonObject = JsonObject(content = map)
        map["text"] = JsonPrimitive(text)
        map["header"] = JsonPrimitive(header)
        return jsonObject
    }

    override fun valueToHtmlString(): String {
        val tagName = when(header){
            1 -> "h1"
            2 -> "h2"
            3 -> "h3"
            4 -> "h4"
            5 -> "h5"
            6 -> "h6"
            else -> ""
        }
        val htmlString = "<$tagName>$text</$tagName>"
        return htmlString
    }
}

class LinkNode(private val text: String, val link: String = ""): Node(name = "link") {
    override fun valueToJsonObject(): JsonObject {
        val map = mutableMapOf<String, JsonElement>()
        val jsonObject = JsonObject(content = map)
        map["text"] = JsonPrimitive(text)
        map["link"] = JsonPrimitive(link)
        return jsonObject
    }
    val encodedText = StringUtils.encodeHtml(text)
    override fun valueToHtmlString(): String {
        return "<a href=$link>$encodedText</a>"
    }
}

// 容器节点
class ColumnNode(): Node(name = "column") {
    override fun valueToHtmlString(): String {
        val builder = StringBuilder()
        builder.append("<div>")

        for(child in this.children) {
            builder.append(child.valueToHtmlString())
        }

        builder.append("</div>")
        return builder.toString()
    }
}

class TextNode(val text: String = "",
               val bold: Boolean = false,
               val italic: Boolean = false,
               val font: String = "",
               val strike: Boolean = false,
               val underline: Boolean = false,
               val color: String = "",
               val background: String = "",): Node(name = "text") {
    override fun valueToJsonObject(): JsonObject {
        val map = mutableMapOf<String, JsonElement>()
        val jsonObject = JsonObject(content = map)
        map["text"] = JsonPrimitive(text)
        map["bold"] = JsonPrimitive(bold)
        map["italic"] = JsonPrimitive(italic)
        map["font"] = JsonPrimitive(font)
        map["strike"] = JsonPrimitive(strike)
        map["underline"] = JsonPrimitive(underline)
        map["color"] = JsonPrimitive(color)
        map["background"] = JsonPrimitive(background)
        return jsonObject
    }
    override fun valueToHtmlString(): String {
        var className = ""
        var style = ""
        if (bold) {
            className += " bold"
        }
        if (italic) {
            className += " italic"
        }
        if (strike) {
            className += " strike"
        }
        if (underline) {
            className += " underline"
        }
        if (background.isNotEmpty()) {
            style += "background:$background;"
        }
        if (font.isNotEmpty()) {
            style += "font-family:$font;"
        }
        if (color.isNotEmpty()) {
            style += "color:$color;"
        }
        if(className.isNotEmpty()) {
            className = " class='$className'"
        }
        if(style.isNotEmpty()) {
            style = " style='$style'"
        }
        return "<span$className$style>$text</span>"
    }
}
