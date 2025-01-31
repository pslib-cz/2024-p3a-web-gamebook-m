using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class ble : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "39e9574a-260f-46fb-8e04-54f22a721be0", "bea07638-d03a-453b-bc7d-5be75436dab4" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "41493973-d798-42c8-9e15-8fbce39018c7", "bea07638-d03a-453b-bc7d-5be75436dab4" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "39e9574a-260f-46fb-8e04-54f22a721be0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "41493973-d798-42c8-9e15-8fbce39018c7");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "bea07638-d03a-453b-bc7d-5be75436dab4");

            migrationBuilder.AddColumn<int>(
                name: "BonusHP",
                table: "Cards",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BonusStrength",
                table: "Cards",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BonusWile",
                table: "Cards",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClassOnly",
                table: "Cards",
                type: "TEXT",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "8338932b-3a48-4151-94c9-c238219061bf", null, "Author", "AUTHOR" },
                    { "dff707a1-b531-4785-baf1-b45d10c8e543", null, "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "c7879628-04c4-4f7d-859f-19ab3a67ce18", 0, "3c0d7deb-7e2d-4aa1-9eef-e2d0a67b8575", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEGD4eidagritB+8hQVkaJRH+9LSrV2yhJ++A2FKnsMK5Haj13v24ZFiAt6PVBvjLlg==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "8338932b-3a48-4151-94c9-c238219061bf", "c7879628-04c4-4f7d-859f-19ab3a67ce18" },
                    { "dff707a1-b531-4785-baf1-b45d10c8e543", "c7879628-04c4-4f7d-859f-19ab3a67ce18" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "8338932b-3a48-4151-94c9-c238219061bf", "c7879628-04c4-4f7d-859f-19ab3a67ce18" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "dff707a1-b531-4785-baf1-b45d10c8e543", "c7879628-04c4-4f7d-859f-19ab3a67ce18" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8338932b-3a48-4151-94c9-c238219061bf");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dff707a1-b531-4785-baf1-b45d10c8e543");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "c7879628-04c4-4f7d-859f-19ab3a67ce18");

            migrationBuilder.DropColumn(
                name: "BonusHP",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "BonusStrength",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "BonusWile",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ClassOnly",
                table: "Cards");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "39e9574a-260f-46fb-8e04-54f22a721be0", null, "Admin", "ADMIN" },
                    { "41493973-d798-42c8-9e15-8fbce39018c7", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "bea07638-d03a-453b-bc7d-5be75436dab4", 0, "362a9a0f-1637-44ae-ade8-7126ca280851", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEPK5trdT6k+CUBmu6wB/Bd4XrhMMBe6vhm0dyg/5ikHXj0yUUpCmmo8H0KnsqqFt5A==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "39e9574a-260f-46fb-8e04-54f22a721be0", "bea07638-d03a-453b-bc7d-5be75436dab4" },
                    { "41493973-d798-42c8-9e15-8fbce39018c7", "bea07638-d03a-453b-bc7d-5be75436dab4" }
                });
        }
    }
}
