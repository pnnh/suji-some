package slate

import kotlinx.serialization.Serializable

@Serializable(with = SFNodeSerializer::class)
abstract class SFNode {
    abstract val name: String
}