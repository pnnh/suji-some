package slate

import kotlinx.serialization.Serializable

@Serializable
data class SFParagraph(override val name: String,
                       override val children: Array<SFNode>): SFElementNode() {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || this::class != other::class) return false
        if (!super.equals(other)) return false

        other as SFParagraph

        if (name != other.name) return false
        if (!children.contentEquals(other.children)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = super.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + children.contentHashCode()
        return result
    }
}