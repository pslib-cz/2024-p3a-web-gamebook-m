using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class grrrr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                    { "c7f4026a-8f36-45c4-b8dc-121ca3d189c3", null, "Admin", "ADMIN" },
                    { "cd9d1bf4-686c-457a-adb3-8a3e83bce751", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "add321cb-5f4f-4376-aa1f-e28277aa063b", 0, "cb14ca17-cb62-4a26-b9d6-1f69b6b492c4", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAENpbG6lGDqqTHLq08TMutxyOz3FmkdWIKWgBGFW4ASZP1zFIAcPYJ/iCSwDbd+hwog==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "c7f4026a-8f36-45c4-b8dc-121ca3d189c3", "add321cb-5f4f-4376-aa1f-e28277aa063b" },
                    { "cd9d1bf4-686c-457a-adb3-8a3e83bce751", "add321cb-5f4f-4376-aa1f-e28277aa063b" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "c7f4026a-8f36-45c4-b8dc-121ca3d189c3", "add321cb-5f4f-4376-aa1f-e28277aa063b" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "cd9d1bf4-686c-457a-adb3-8a3e83bce751", "add321cb-5f4f-4376-aa1f-e28277aa063b" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c7f4026a-8f36-45c4-b8dc-121ca3d189c3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cd9d1bf4-686c-457a-adb3-8a3e83bce751");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "add321cb-5f4f-4376-aa1f-e28277aa063b");

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
    }
}
