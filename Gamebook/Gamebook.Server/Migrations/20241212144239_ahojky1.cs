using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class ahojky1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "1a264ec1-06c9-476a-bd66-9c2d1f8f4bdd", "e28763ed-48f7-4c29-aabe-751b47fbd8ea" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "9944988d-5f5d-43ce-8357-e97c267cebad", "e28763ed-48f7-4c29-aabe-751b47fbd8ea" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1a264ec1-06c9-476a-bd66-9c2d1f8f4bdd");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9944988d-5f5d-43ce-8357-e97c267cebad");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e28763ed-48f7-4c29-aabe-751b47fbd8ea");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "383c1213-d090-4fca-8d2b-f612cf3245b9", null, "Author", "AUTHOR" },
                    { "accb0992-1b86-4445-b8ea-4ac024b767b3", null, "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "4a22fbd1-38c2-4b58-8b5a-f7b318dd9a7a", 0, "f5f3c198-a765-4df2-8103-10ea5f801f67", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEEC51RESEvHyN8jhJyYHTIAQlHZFmnIQ3nmHJtD4azUP2007E9N0oou2iXVRQrHQYg==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "383c1213-d090-4fca-8d2b-f612cf3245b9", "4a22fbd1-38c2-4b58-8b5a-f7b318dd9a7a" },
                    { "accb0992-1b86-4445-b8ea-4ac024b767b3", "4a22fbd1-38c2-4b58-8b5a-f7b318dd9a7a" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "383c1213-d090-4fca-8d2b-f612cf3245b9", "4a22fbd1-38c2-4b58-8b5a-f7b318dd9a7a" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "accb0992-1b86-4445-b8ea-4ac024b767b3", "4a22fbd1-38c2-4b58-8b5a-f7b318dd9a7a" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "383c1213-d090-4fca-8d2b-f612cf3245b9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "accb0992-1b86-4445-b8ea-4ac024b767b3");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "4a22fbd1-38c2-4b58-8b5a-f7b318dd9a7a");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1a264ec1-06c9-476a-bd66-9c2d1f8f4bdd", null, "Admin", "ADMIN" },
                    { "9944988d-5f5d-43ce-8357-e97c267cebad", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "e28763ed-48f7-4c29-aabe-751b47fbd8ea", 0, "6bd69c9d-5893-4ddf-bf17-fa2e8bf51bfc", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEI8MbS9J4N3YwksDMbzKr02KoHF1hNYK3kJXbGX9kxvTTvZPIIdt52WjqKKcD0SQiQ==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "1a264ec1-06c9-476a-bd66-9c2d1f8f4bdd", "e28763ed-48f7-4c29-aabe-751b47fbd8ea" },
                    { "9944988d-5f5d-43ce-8357-e97c267cebad", "e28763ed-48f7-4c29-aabe-751b47fbd8ea" }
                });
        }
    }
}
