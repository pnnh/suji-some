package server.db

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import server.models.*

object AccountTable : Table("accounts") {
    val pk = varchar("pk", dbNameLength)
    val uname = varchar("uname", dbNameLength)
    val image = text("image")

    override val primaryKey = PrimaryKey(pk, name = "quests_pk")
}

fun queryAccount(pk: String): Account? {
    var account: Account? = null
    transaction {
        val result = AccountTable.select {
            AccountTable.pk eq pk
        }.limit(1).firstOrNull()

        if(result != null) {
            account = Account(pk = result[AccountTable.pk],
                image = result[AccountTable.image])
        }
    }
    return account
}