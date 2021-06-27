package delta

import kotlinx.serialization.*

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
data class OpInsert(val insert: String,
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