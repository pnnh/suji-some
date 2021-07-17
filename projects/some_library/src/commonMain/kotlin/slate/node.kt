package slate

import kotlinx.serialization.Serializable

@Serializable(with = SFNodeSerializer::class)
abstract class SFNode {
    abstract val name: String
}

@Serializable
abstract class SFElementNode(): SFNode() {
    abstract val children: Array<SFNode>

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || this::class != other::class) return false

        other as SFElementNode

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

@Serializable
abstract class SFTextNode(): SFNode() {
    abstract val text: String
}