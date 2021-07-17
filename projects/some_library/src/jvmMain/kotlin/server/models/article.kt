package server.models

import org.joda.time.DateTime

data class Article (
    var pk: String,
    val title: String,
    val body: String,
    val create_time: DateTime,
    val update_time: DateTime,
    val creator: String,
)