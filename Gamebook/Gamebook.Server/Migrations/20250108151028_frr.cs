using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class frr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "bd45174c-5013-48a2-9b56-7d66d6161e88", "9e87d7ba-0705-4d12-8fcc-23c1989a6533" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "f9b12b26-8e5d-46c9-be28-b05e451ba1ef", "9e87d7ba-0705-4d12-8fcc-23c1989a6533" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bd45174c-5013-48a2-9b56-7d66d6161e88");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f9b12b26-8e5d-46c9-be28-b05e451ba1ef");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "9e87d7ba-0705-4d12-8fcc-23c1989a6533");

            migrationBuilder.AlterColumn<string>(
                name: "DiceRollResults",
                table: "Fields",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                name: "DiceRollResults",
                table: "Fields",
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
                    { "bd45174c-5013-48a2-9b56-7d66d6161e88", null, "Admin", "ADMIN" },
                    { "f9b12b26-8e5d-46c9-be28-b05e451ba1ef", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "9e87d7ba-0705-4d12-8fcc-23c1989a6533", 0, "e98f6a04-b016-40db-a21d-a292647f998b", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEOKqAFb9BBWCcufUOqFB5Vm3v8hlyo8tUQwhklltbd11g3DgtE3ZvQmPjyYzqV2Owg==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "bd45174c-5013-48a2-9b56-7d66d6161e88", "9e87d7ba-0705-4d12-8fcc-23c1989a6533" },
                    { "f9b12b26-8e5d-46c9-be28-b05e451ba1ef", "9e87d7ba-0705-4d12-8fcc-23c1989a6533" }
                });
        }
    }
}
