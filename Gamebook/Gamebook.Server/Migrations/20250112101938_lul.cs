using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class lul : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "766ce8d9-f0dd-4156-b9ac-ca4a62eeef57", "d00f7361-5b13-4a06-999e-5921d4368186" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "94ba9043-1bba-4ded-8db0-baf0db513140", "d00f7361-5b13-4a06-999e-5921d4368186" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "766ce8d9-f0dd-4156-b9ac-ca4a62eeef57");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "94ba9043-1bba-4ded-8db0-baf0db513140");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "d00f7361-5b13-4a06-999e-5921d4368186");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Cards",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Cards");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "766ce8d9-f0dd-4156-b9ac-ca4a62eeef57", null, "Admin", "ADMIN" },
                    { "94ba9043-1bba-4ded-8db0-baf0db513140", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "d00f7361-5b13-4a06-999e-5921d4368186", 0, "789e0342-c553-4ce0-a20e-a2250c74d11a", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEJB68HXR/OhmoUrfNqV18wLJOElbr7UaL0ebX+NbvMztfJY79TzmNntbMcSn2NIyRQ==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "766ce8d9-f0dd-4156-b9ac-ca4a62eeef57", "d00f7361-5b13-4a06-999e-5921d4368186" },
                    { "94ba9043-1bba-4ded-8db0-baf0db513140", "d00f7361-5b13-4a06-999e-5921d4368186" }
                });
        }
    }
}
