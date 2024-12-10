using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class brum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5a1399ac-7bb3-48cb-956c-2621c70892b6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "91c0cad5-43e9-4ed9-a7a1-6631262d3567");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e563d53e-ad5d-4f26-ac7f-f0d1df1a7242");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1972f63f-e9bf-4866-97e5-0ab610cc11f8", null, "Admin", "ADMIN" },
                    { "24e9619a-0eff-409e-b2dc-f8c5f7adc3a7", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "536818a4-a37b-4b30-8829-b88de1c509db", 0, "d9fdfea9-32b6-408b-a311-72b756585179", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEB29hA3t3B422jWCbrukYsCT4yoFSlnEqjey75DHRCdJsMftF7x0nhtClaQD1ICRtg==", null, false, "", false, "admin@localhost.test" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1972f63f-e9bf-4866-97e5-0ab610cc11f8");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "24e9619a-0eff-409e-b2dc-f8c5f7adc3a7");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "536818a4-a37b-4b30-8829-b88de1c509db");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "5a1399ac-7bb3-48cb-956c-2621c70892b6", null, "Admin", "ADMIN" },
                    { "91c0cad5-43e9-4ed9-a7a1-6631262d3567", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "e563d53e-ad5d-4f26-ac7f-f0d1df1a7242", 0, "a3a2e25b-3c24-4beb-8192-5bc31347696e", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEALahUfGrKKeO5A33S/VvhwJOSKvGYgZLD3nmIcrsXXe/V0qtYP0vC0Mp/xa9ZWiGA==", null, false, "", false, "admin@localhost.test" });
        }
    }
}
