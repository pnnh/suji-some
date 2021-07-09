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
        val jsonObject = node.valueToJsonObject()
        val a = json.encodeToString<JsonObject>(JsonObject.serializer(), jsonObject)
        return a
    }
    fun encodeToHtmlString(node: Node): String {
        return node.valueToHtmlString()
    }
}

class HeaderNode(private val text: String, private val header: Int = 0): Node(name = "header") {
    override fun valueToJsonObject(): JsonObject {
        val valueMap = mutableMapOf<String, JsonElement>()
        valueMap["text"] = JsonPrimitive(text)
        valueMap["header"] = JsonPrimitive(header)
        val nodeMap = mutableMapOf<String, JsonElement>()
        nodeMap["name"] = JsonPrimitive(this.name)
        nodeMap["value"] = JsonObject(content = valueMap)
        return JsonObject(content = nodeMap)
    }

    override fun valueToHtmlString(): String {
        val tagName = when (header) {
            1 -> "h1"
            2 -> "h2"
            3 -> "h3"
            4 -> "h4"
            5 -> "h5"
            6 -> "h6"
            else -> ""
        }
        val encodedText = StringUtils.encodeHtml(text)
        return "<$tagName>$encodedText</$tagName>"
    }
}

class LinkNode(private val text: String, private val link: String = ""): Node(name = "link") {
    override fun valueToJsonObject(): JsonObject {
        val valueMap = mutableMapOf<String, JsonElement>()
        valueMap["text"] = JsonPrimitive(text)
        valueMap["link"] = JsonPrimitive(link)
        val nodeMap = mutableMapOf<String, JsonElement>()
        nodeMap["name"] = JsonPrimitive(this.name)
        nodeMap["value"] = JsonObject(content = valueMap)
        return JsonObject(content = nodeMap)
    }
    override fun valueToHtmlString(): String {
        val encodedText = StringUtils.encodeHtml(text)
        return "<a href=$link>$encodedText</a>"
    }
}

// 容器节点
class ColumnNode(): Node(name = "column") {
    override fun valueToJsonObject(): JsonObject {
        val map = mutableMapOf<String, JsonElement>()
        val jsonObject = JsonObject(content = map)
        map["name"] = JsonPrimitive(this.name)
        val list = arrayListOf<JsonObject>()
        for(b in this.children) {
            val subMap = b.valueToJsonObject()
            list.add(subMap)
        }
        map["children"] = JsonArray(list)
        return jsonObject
    }
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
        val valueMap = mutableMapOf<String, JsonElement>()
        valueMap["text"] = JsonPrimitive(text)
        valueMap["bold"] = JsonPrimitive(bold)
        valueMap["italic"] = JsonPrimitive(italic)
        valueMap["font"] = JsonPrimitive(font)
        valueMap["strike"] = JsonPrimitive(strike)
        valueMap["underline"] = JsonPrimitive(underline)
        valueMap["color"] = JsonPrimitive(color)
        valueMap["background"] = JsonPrimitive(background)
        val nodeMap = mutableMapOf<String, JsonElement>()
        nodeMap["name"] = JsonPrimitive(this.name)
        nodeMap["value"] = JsonObject(content = valueMap)
        return JsonObject(content = nodeMap)
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
        val encodedText = StringUtils.encodeHtml(text)
        return "<span$className$style>$encodedText</span>"
    }
}
