using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class brumm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                    { "4ce4e380-d82a-4056-a82e-e0395d7918fd", null, "Author", "AUTHOR" },
                    { "aabf1cf1-04b7-4910-8924-127c8064fd24", null, "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "dbddcd73-d124-4534-9609-3fb0bf4bf6af", 0, "83cad3ed-ae0f-4b7a-95c9-9ee31d399949", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEDM7fghnMnQyDCL/Q1NmxDXB57+rO1FhPQdJwKP4vaS2NrjY5+BDs52EpcDfdpPdOw==", null, false, "", false, "admin@localhost.test" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4ce4e380-d82a-4056-a82e-e0395d7918fd");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "aabf1cf1-04b7-4910-8924-127c8064fd24");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbddcd73-d124-4534-9609-3fb0bf4bf6af");

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
    }
}
