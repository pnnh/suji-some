package server.models

import kotlinx.serialization.Serializable

@Serializable
data class Quest (
    var pk: String,
    val priority: Int,
    val title: String,
    val executor: String,
    val creator: String,
    val project: String,
    val tags: String,
    val parent: String,
//    val create_time: DateTime,
//    val update_time: DateTime,
    val status: Int,
    val organization: String,
    val description: String,
)