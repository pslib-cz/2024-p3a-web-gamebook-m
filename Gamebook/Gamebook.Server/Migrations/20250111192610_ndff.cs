using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class ndff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Fields_Enemies_EnemyId",
                table: "Fields");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "40f9910f-025e-4339-8f3a-93df38a6d508", "83bad36e-0fb7-4cfa-8c16-a3b11dea2a6b" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "566f1642-21ad-4c86-bfaa-acb947d9a5f9", "83bad36e-0fb7-4cfa-8c16-a3b11dea2a6b" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "40f9910f-025e-4339-8f3a-93df38a6d508");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "566f1642-21ad-4c86-bfaa-acb947d9a5f9");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "83bad36e-0fb7-4cfa-8c16-a3b11dea2a6b");

            migrationBuilder.RenameColumn(
                name: "EnemyId",
                table: "Fields",
                newName: "CardId");

            migrationBuilder.RenameIndex(
                name: "IX_Fields_EnemyId",
                table: "Fields",
                newName: "IX_Fields_CardId");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "766ce8d9-f0dd-4156-b9ac-ca4a62eeef57", null, "Admin", "ADMIN" },
                    { "94ba9043-1bba-4ded-8db0-baf0db513140", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "d00f7361-5b13-4a06-999e-5921d4368186", 0, "789e0342-c553-4ce0-a20e-a2250c74d11a", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEJB68HXR/OhmoUrfNqV18wLJOElbr7UaL0ebX+NbvMztfJY79TzmNntbMcSn2NIyRQ==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "766ce8d9-f0dd-4156-b9ac-ca4a62eeef57", "d00f7361-5b13-4a06-999e-5921d4368186" },
                    { "94ba9043-1bba-4ded-8db0-baf0db513140", "d00f7361-5b13-4a06-999e-5921d4368186" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Fields_Cards_CardId",
                table: "Fields",
                column: "CardId",
                principalTable: "Cards",
                principalColumn: "CardId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Fields_Cards_CardId",
                table: "Fields");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "766ce8d9-f0dd-4156-b9ac-ca4a62eeef57", "d00f7361-5b13-4a06-999e-5921d4368186" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "94ba9043-1bba-4ded-8db0-baf0db513140", "d00f7361-5b13-4a06-999e-5921d4368186" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "766ce8d9-f0dd-4156-b9ac-ca4a62eeef57");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "94ba9043-1bba-4ded-8db0-baf0db513140");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "d00f7361-5b13-4a06-999e-5921d4368186");

            migrationBuilder.RenameColumn(
                name: "CardId",
                table: "Fields",
                newName: "EnemyId");

            migrationBuilder.RenameIndex(
                name: "IX_Fields_CardId",
                table: "Fields",
                newName: "IX_Fields_EnemyId");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "40f9910f-025e-4339-8f3a-93df38a6d508", null, "Admin", "ADMIN" },
                    { "566f1642-21ad-4c86-bfaa-acb947d9a5f9", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "83bad36e-0fb7-4cfa-8c16-a3b11dea2a6b", 0, "cdf261f8-5587-45d3-a37f-cb91f9851b06", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEMGD7MQm9eK2DiTpOWVKXKLfPKUiWEsNIicx0HtGKtcVgdadnoU5BagILoWnysPO+g==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "40f9910f-025e-4339-8f3a-93df38a6d508", "83bad36e-0fb7-4cfa-8c16-a3b11dea2a6b" },
                    { "566f1642-21ad-4c86-bfaa-acb947d9a5f9", "83bad36e-0fb7-4cfa-8c16-a3b11dea2a6b" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Fields_Enemies_EnemyId",
                table: "Fields",
                column: "EnemyId",
                principalTable: "Enemies",
                principalColumn: "EnemyId");
        }
    }
}
