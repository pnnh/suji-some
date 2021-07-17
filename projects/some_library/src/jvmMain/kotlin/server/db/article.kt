package server.db

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.jodatime.*
import org.jetbrains.exposed.sql.jodatime.DateColumnType
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.vendors.MysqlDialect
import org.jetbrains.exposed.sql.vendors.SQLiteDialect
import org.jetbrains.exposed.sql.vendors.currentDialect
import org.joda.time.DateTime
import org.joda.time.DateTimeZone
import org.postgresql.util.PGobject
import server.models.Article

class JsonColumnType() : ColumnType() {
    override fun sqlType(): String = "json"

    override fun valueFromDB(value: Any): String {
        if (value is String) return value
        value as PGobject
        return value.value
    }
}

fun Table.json(name: String): Column<String> = registerColumn(name, JsonColumnType())

object ArticleTable : Table("articles") {
    val pk = varchar("pk", dbNameLength)
    val title = varchar("title", length = dbNameLength)
    val body = json("body")
    val create_time = datetime("create_time")
    val update_time = datetime("update_time")
    val creator = varchar("creator", dbNameLength)

    override val primaryKey = PrimaryKey(pk, name = "articles_pk")
}

fun queryArticle(pk: String): Article? {
    var article: Article? = null
    transaction {
        val result = ArticleTable.select {
            ArticleTable.pk eq pk
        }.limit(1).firstOrNull()

        if(result != null) {
            article = Article(pk = result[ArticleTable.pk],
                title = result[ArticleTable.title],
                body = result[ArticleTable.body],
                creator = result[ArticleTable.creator],
                create_time = result[ArticleTable.create_time],
                update_time = result[ArticleTable.update_time]
            )
        }
    }
    return article
}