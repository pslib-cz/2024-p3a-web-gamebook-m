using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class hth54555 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                    { "52e853fe-af8e-4a3d-ba54-a5cde401d6e3", null, "Admin", "ADMIN" },
                    { "b46277d7-50f7-400e-a3cd-a770df5e3319", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "a5b3b45a-1857-4aa1-8c5f-c1b27de7422e", 0, "56057084-c1c0-4651-8afe-f508a3e044c1", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAELlkD/oYsLkzC//53i9eJAmUEZ2pAT1DamXHiNgBd8YSRdmiajtL/eaj45yFDhxjAA==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "52e853fe-af8e-4a3d-ba54-a5cde401d6e3", "a5b3b45a-1857-4aa1-8c5f-c1b27de7422e" },
                    { "b46277d7-50f7-400e-a3cd-a770df5e3319", "a5b3b45a-1857-4aa1-8c5f-c1b27de7422e" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "52e853fe-af8e-4a3d-ba54-a5cde401d6e3", "a5b3b45a-1857-4aa1-8c5f-c1b27de7422e" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "b46277d7-50f7-400e-a3cd-a770df5e3319", "a5b3b45a-1857-4aa1-8c5f-c1b27de7422e" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "52e853fe-af8e-4a3d-ba54-a5cde401d6e3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b46277d7-50f7-400e-a3cd-a770df5e3319");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "a5b3b45a-1857-4aa1-8c5f-c1b27de7422e");

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
    }
}
