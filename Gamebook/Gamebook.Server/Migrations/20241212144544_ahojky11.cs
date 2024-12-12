using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class ahojky11 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                    { "68e8391c-3b10-45d1-abca-f17028dddfa7", null, "Author", "AUTHOR" },
                    { "ef9726c6-fd1c-4df3-86f6-0e3826ab6e16", null, "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "cbed728e-64c5-45b2-897f-d189b5c3c78b", 0, "bc56c1d5-8be2-4646-a3d6-1ec5c74b10cf", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEKl5IGdJ85XiKVzsohH4y33TM/yXrNF+d01rI6viVP5+WPQeEEdgPwBmh7XbN+dpww==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "68e8391c-3b10-45d1-abca-f17028dddfa7", "cbed728e-64c5-45b2-897f-d189b5c3c78b" },
                    { "ef9726c6-fd1c-4df3-86f6-0e3826ab6e16", "cbed728e-64c5-45b2-897f-d189b5c3c78b" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "68e8391c-3b10-45d1-abca-f17028dddfa7", "cbed728e-64c5-45b2-897f-d189b5c3c78b" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "ef9726c6-fd1c-4df3-86f6-0e3826ab6e16", "cbed728e-64c5-45b2-897f-d189b5c3c78b" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "68e8391c-3b10-45d1-abca-f17028dddfa7");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ef9726c6-fd1c-4df3-86f6-0e3826ab6e16");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "cbed728e-64c5-45b2-897f-d189b5c3c78b");

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
    }
}
