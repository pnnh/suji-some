package slate

import kotlinx.serialization.Serializable

@Serializable
data class SFEditor(val children: Array<SFNode> = emptyArray<SFNode>()) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || this::class != other::class) return false

        other as SFEditor

        if (!children.contentEquals(other.children)) return false

        return true
    }

    override fun hashCode(): Int {
        return children.contentHashCode()
    }

}