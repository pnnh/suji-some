package slate

import kotlinx.serialization.Serializable

@Serializable
abstract class SFElement(): SFNode() {
    abstract val children: Array<SFNode>

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || this::class != other::class) return false

        other as SFElement

        if (name != other.name) return false
        if (!children.contentEquals(other.children)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = name.hashCode()
        result = 31 * result + children.contentHashCode()
        return result
    }
}