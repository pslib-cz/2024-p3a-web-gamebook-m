using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class hth545 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "3459be27-bbe1-4d20-8c16-0f4b64bfe057", "7c848dd2-5bae-4bfb-ada8-c55bb058c20a" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "9c389321-219b-4220-b3e4-d153005bc3d0", "7c848dd2-5bae-4bfb-ada8-c55bb058c20a" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3459be27-bbe1-4d20-8c16-0f4b64bfe057");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9c389321-219b-4220-b3e4-d153005bc3d0");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "7c848dd2-5bae-4bfb-ada8-c55bb058c20a");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "98125c45-b234-4936-9a28-b4a9bde14368", null, "Admin", "ADMIN" },
                    { "c4ef5dd8-3e8c-4071-a093-6db47d38919e", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "12426a07-a48d-4d4c-8159-03ce30c4f4e5", 0, "fc0d12c4-eca9-40b6-9073-bbe13e1f8cb8", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEOphwqViKI5tus2rCssBqjRsa5kNtOjtmwBSCyPa7psGe6Iu9yspfd6SlmA+Nib6LA==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "98125c45-b234-4936-9a28-b4a9bde14368", "12426a07-a48d-4d4c-8159-03ce30c4f4e5" },
                    { "c4ef5dd8-3e8c-4071-a093-6db47d38919e", "12426a07-a48d-4d4c-8159-03ce30c4f4e5" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "98125c45-b234-4936-9a28-b4a9bde14368", "12426a07-a48d-4d4c-8159-03ce30c4f4e5" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "c4ef5dd8-3e8c-4071-a093-6db47d38919e", "12426a07-a48d-4d4c-8159-03ce30c4f4e5" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "98125c45-b234-4936-9a28-b4a9bde14368");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c4ef5dd8-3e8c-4071-a093-6db47d38919e");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "12426a07-a48d-4d4c-8159-03ce30c4f4e5");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3459be27-bbe1-4d20-8c16-0f4b64bfe057", null, "Admin", "ADMIN" },
                    { "9c389321-219b-4220-b3e4-d153005bc3d0", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "7c848dd2-5bae-4bfb-ada8-c55bb058c20a", 0, "47386ec9-285b-493c-887e-9680d8a3fc5a", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAED6EdNDYyPM7/HiC148Sb/G4g4GgVrBC6t8+hCozh3OZn+tZ/J7BnOh/w1pTw0zFEg==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "3459be27-bbe1-4d20-8c16-0f4b64bfe057", "7c848dd2-5bae-4bfb-ada8-c55bb058c20a" },
                    { "9c389321-219b-4220-b3e4-d153005bc3d0", "7c848dd2-5bae-4bfb-ada8-c55bb058c20a" }
                });
        }
    }
}
