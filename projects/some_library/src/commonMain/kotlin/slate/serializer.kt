package slate

import kotlinx.serialization.DeserializationStrategy
import kotlinx.serialization.json.JsonContentPolymorphicSerializer
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.jsonObject

object SFNodeSerializer :
    JsonContentPolymorphicSerializer<SFNode>(SFNode::class) {

    override fun selectDeserializer(element: JsonElement): DeserializationStrategy<out SFNode> {
        return when(getName(element)) {
            "paragraph" -> SFParagraph.serializer()
            "header" -> SFHeader.serializer()
            "code-block" -> SFCodeBlock.serializer()
            "code" -> SFCode.serializer()
            "text" -> SFText.serializer()
            else -> throw IllegalArgumentException("无效节点类型")
        }
    }

    private fun getName(element: JsonElement): String {
        val a = element.jsonObject["name"]
        if (a is JsonPrimitive) {
            return a.content
        }
        throw IllegalArgumentException("不支持节点类型")
    }
}