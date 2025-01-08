using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class fr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "07ef4b5a-cdef-47eb-ba54-835807938a35", "402d0607-2ce8-4204-b66a-63416815a8bd" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "816552c9-6f2c-41e0-97ba-b8d65ebce782", "402d0607-2ce8-4204-b66a-63416815a8bd" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "07ef4b5a-cdef-47eb-ba54-835807938a35");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "816552c9-6f2c-41e0-97ba-b8d65ebce782");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "402d0607-2ce8-4204-b66a-63416815a8bd");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "07ef4b5a-cdef-47eb-ba54-835807938a35", null, "Admin", "ADMIN" },
                    { "816552c9-6f2c-41e0-97ba-b8d65ebce782", null, "Author", "AUTHOR" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "402d0607-2ce8-4204-b66a-63416815a8bd", 0, "20e66a47-5bbf-45e1-8c7f-a67463e00738", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEKz6KFDu3iUZ3p82QyHw82o3WSnjZQfNtK0rRqRrCT8c2pcii2DpHAVhvFKXdcKLUg==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "07ef4b5a-cdef-47eb-ba54-835807938a35", "402d0607-2ce8-4204-b66a-63416815a8bd" },
                    { "816552c9-6f2c-41e0-97ba-b8d65ebce782", "402d0607-2ce8-4204-b66a-63416815a8bd" }
                });
        }
    }
}
