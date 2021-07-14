package slate

import kotlinx.serialization.Serializable

@Serializable
data class SFHeader(val header: Int,
                    override val children: Array<SFNode>, override val name: String): SFElement() {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || this::class != other::class) return false
        if (!super.equals(other)) return false

        other as SFHeader

        if (header != other.header) return false
        if (!children.contentEquals(other.children)) return false
        if (name != other.name) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + header
        result = 31 * result + children.contentHashCode()
        result = 31 * result + name.hashCode()
        return result
    }
}