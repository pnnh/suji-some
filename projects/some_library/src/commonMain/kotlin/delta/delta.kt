package delta

import kotlinx.serialization.*
import kotlinx.serialization.builtins.LongAsStringSerializer
import kotlinx.serialization.descriptors.SerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder
import kotlinx.serialization.encoding.decodeStructure
import kotlinx.serialization.json.JsonContentPolymorphicSerializer
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.jsonObject

@Serializable
abstract class Value(val value: String = "")

@Serializable
data class ObjectValue(val intValue: Int = 0): Value()

@Serializable
data class StringValue(val stringValue: String = ""): Value()

//@Serializable
//data class InsertObject(val stringValue: String = "", val objectValue: ObjectValue = ObjectValue())
@Serializable(with = ProjectSerializer::class)
data class InsertObject(val stringValue: String = "")

//object StringValueSerializer : KSerializer<InsertObject> {
//    override val descriptor: SerialDescriptor = InsertObject.serializer().descriptor
//    override fun serialize(encoder: Encoder, value: InsertObject) {
//        //encoder.encodeString(value.stringValue)
//        ""
//    }
//    //@ExperimentalSerializationApi
//    override fun deserialize(decoder: Decoder): InsertObject {
//        val str = decoder.decodeString()
//        return InsertObject()
//    }
//}
//
//object ObjectValueSerializer : KSerializer<InsertObject> {
//    override val descriptor: SerialDescriptor = InsertObject.serializer().descriptor
//    override fun serialize(encoder: Encoder, value: InsertObject) {
//        //encoder.encodeString(value.stringValue)
//        ""
//    }
//    //@ExperimentalSerializationApi
//    override fun deserialize(decoder: Decoder): InsertObject {
//        val str = decoder.decodeString()
//        return InsertObject()
//    }
//}


object ProjectSerializer : JsonContentPolymorphicSerializer<StringValue>(StringValue::class) {
    override fun selectDeserializer(element: JsonElement) {
         Value.serializer()
    }
}

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
data class OpInsert(
    @Serializable(with = ProjectSerializer::class)
    val insert: Value = StringValue(),
    //val insert: String = "",
                    val retain: Int = 0,
                    val delete: Int = 0,
    val attributes: InsertAttributes = InsertAttributes())

@Serializable
data class Delta(val ops: Array<OpInsert> = emptyArray<OpInsert>(),) {
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