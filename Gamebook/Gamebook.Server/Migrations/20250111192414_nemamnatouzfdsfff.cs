using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class nemamnatouzfdsfff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "285f8c54-1255-4862-a795-bd988c94faaf", "00f2c960-1dba-4793-99c2-304cc5fecf4c" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "bc441eee-7537-4b6c-afed-0d0919c745e4", "00f2c960-1dba-4793-99c2-304cc5fecf4c" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "285f8c54-1255-4862-a795-bd988c94faaf");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bc441eee-7537-4b6c-afed-0d0919c745e4");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "00f2c960-1dba-4793-99c2-304cc5fecf4c");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "285f8c54-1255-4862-a795-bd988c94faaf", null, "Admin", "ADMIN" },
                    { "bc441eee-7537-4b6c-afed-0d0919c745e4", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "00f2c960-1dba-4793-99c2-304cc5fecf4c", 0, "a59abbe0-72be-4208-a363-5ef783fd8e24", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAED+qqjIKdI78t860Xv8VNMk1D4HOowo+NSzxfdZgkOFA9VBZc24WZzwO0wBFRdnNZA==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "285f8c54-1255-4862-a795-bd988c94faaf", "00f2c960-1dba-4793-99c2-304cc5fecf4c" },
                    { "bc441eee-7537-4b6c-afed-0d0919c745e4", "00f2c960-1dba-4793-99c2-304cc5fecf4c" }
                });
        }
    }
}
