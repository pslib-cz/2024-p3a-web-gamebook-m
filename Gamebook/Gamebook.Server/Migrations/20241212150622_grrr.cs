using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class grrr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                    { "3b5d2bc4-ad43-4df0-9b3c-5539d7ce7439", null, "Admin", "ADMIN" },
                    { "47389e54-1e48-4569-ad37-a8d784f960cb", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "5023aecc-4c55-4459-8f16-c29f8ce2e8b4", 0, "d7ea1894-707e-4334-8d20-95d9f5154c4f", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEBQ+WQsvRX7dQhO6DhusKuBRVoIJWkbPM6zNrSadN36LKsBTWWZj2feDLMtoaXJpJQ==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "3b5d2bc4-ad43-4df0-9b3c-5539d7ce7439", "5023aecc-4c55-4459-8f16-c29f8ce2e8b4" },
                    { "47389e54-1e48-4569-ad37-a8d784f960cb", "5023aecc-4c55-4459-8f16-c29f8ce2e8b4" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "3b5d2bc4-ad43-4df0-9b3c-5539d7ce7439", "5023aecc-4c55-4459-8f16-c29f8ce2e8b4" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "47389e54-1e48-4569-ad37-a8d784f960cb", "5023aecc-4c55-4459-8f16-c29f8ce2e8b4" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3b5d2bc4-ad43-4df0-9b3c-5539d7ce7439");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "47389e54-1e48-4569-ad37-a8d784f960cb");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "5023aecc-4c55-4459-8f16-c29f8ce2e8b4");

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
    }
}
