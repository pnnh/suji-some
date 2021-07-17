package slate

import kotlinx.serialization.Serializable

@Serializable
data class SFHeader(override val name: String, override val children: Array<SFNode>,
                    val header: Int): SFElementNode() {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || this::class != other::class) return false
        if (!super.equals(other)) return false

        other as SFHeader

        if (name != other.name) return false
        if (!children.contentEquals(other.children)) return false
        if (header != other.header) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + children.contentHashCode()
        result = 31 * result + header
        return result
    }
}