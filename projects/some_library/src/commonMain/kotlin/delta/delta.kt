package delta

import kotlinx.serialization.*
import kotlinx.serialization.json.*

@Serializable
data class ObjectValue(val formula: String = "", val image: String = "")


@Serializable(with = OpSerializer::class)
abstract class Op {

}

@Serializable
data class OpObject(
    @SerialName("insert")
    val insert: ObjectValue = ObjectValue(),
    val retain: Int = 0,
    val delete: Int = 0,
    val attributes: InsertAttributes = InsertAttributes()
) : Op()

@Serializable
data class OpString(
    @SerialName("insert")
    val insert: String = "",
    val retain: Int = 0,
    val delete: Int = 0,
    val attributes: InsertAttributes = InsertAttributes()
) : Op()

//object ProjectSerializer : JsonContentPolymorphicSerializer<Value>(Value::class) {
//    override fun selectDeserializer(element: JsonElement) {
//        StringValue()
//    }
//}

@Serializable
data class InsertAttributes(val link: String = "",
    val header: Int = 0,
    val list: String = "",
    @SerialName("code-block")
    val codeBlock: Boolean = false,
    val bold: Boolean = false,
    val italic: Boolean = false,
    val font: String = "",
    val strike: Boolean = false,
    val underline: Boolean = false,
    val color: String = "",
    val background: String = "",
    val align: String = "",
    val blockquote: Boolean = false,)

@Serializable
data class Delta(val ops: Array<Op> = emptyArray<Op>(),) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || this::class != other::class) return false

        other as Delta

        if (!ops.contentEquals(other.ops)) return false

        return true
    }

    override fun hashCode(): Int {
        return ops.contentHashCode()
    }
}


private object OpSerializer :
    JsonContentPolymorphicSerializer<Op>(Op::class) {

    override fun selectDeserializer(element: JsonElement): DeserializationStrategy<out Op> {
        return when {
            isString(element) -> OpString.serializer()
            else -> OpObject.serializer()
        }
    }

    private fun isString(element: JsonElement): Boolean {
        val a = element.jsonObject["insert"]
        return a is JsonPrimitive
    }
}