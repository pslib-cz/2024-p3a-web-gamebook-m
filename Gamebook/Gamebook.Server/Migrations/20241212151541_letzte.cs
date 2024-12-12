using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class letzte : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
    }
}
