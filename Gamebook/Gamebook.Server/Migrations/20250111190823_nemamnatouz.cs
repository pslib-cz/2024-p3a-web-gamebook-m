using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class nemamnatouz : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "28f152a1-8ff9-4537-bb8c-000b5feac8c9", "a06f5c02-28ff-439a-b29c-9fe7f1eb8316" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "44ed3e6c-bc90-4775-b409-498fbc45a474", "a06f5c02-28ff-439a-b29c-9fe7f1eb8316" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "28f152a1-8ff9-4537-bb8c-000b5feac8c9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "44ed3e6c-bc90-4775-b409-498fbc45a474");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "a06f5c02-28ff-439a-b29c-9fe7f1eb8316");

            migrationBuilder.AlterColumn<string>(
                name: "SpecialAbilities",
                table: "Cards",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<string>(
                name: "SpecialAbilities",
                table: "Cards",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "28f152a1-8ff9-4537-bb8c-000b5feac8c9", null, "Admin", "ADMIN" },
                    { "44ed3e6c-bc90-4775-b409-498fbc45a474", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "a06f5c02-28ff-439a-b29c-9fe7f1eb8316", 0, "c8d7ef57-3a3d-4987-b620-ef4abdb043c7", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEF3CkUrOhOh5U9H+7QTNrI76hqaHcZmQN5SRfT75gkiXVoOYPh5z40nldb2Dk3pFcw==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "28f152a1-8ff9-4537-bb8c-000b5feac8c9", "a06f5c02-28ff-439a-b29c-9fe7f1eb8316" },
                    { "44ed3e6c-bc90-4775-b409-498fbc45a474", "a06f5c02-28ff-439a-b29c-9fe7f1eb8316" }
                });
        }
    }
}
