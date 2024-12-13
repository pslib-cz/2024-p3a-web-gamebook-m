using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class db1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_GameStates_GameStateId",
                table: "Games");

            migrationBuilder.DropForeignKey(
                name: "FK_GameStates_Characters_CharacterId",
                table: "GameStates");

            migrationBuilder.DropForeignKey(
                name: "FK_GameStates_Fields_ActualFieldId",
                table: "GameStates");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "3ebb8db8-59db-4461-a0dd-108c9fd305d1", "88cd4614-c049-4289-92b0-daf800b7f098" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "844a72a2-3519-4e63-ad93-909468198681", "88cd4614-c049-4289-92b0-da" +
                "f800b7f098" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3ebb8db8-59db-4461-a0dd-108c9fd305d1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "844a72a2-3519-4e63-ad93-909468198681");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "88cd4614-c049-4289-92b0-daf800b7f098");

            migrationBuilder.AlterColumn<int>(
                name: "CharacterId",
                table: "GameStates",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<int>(
                name: "ActualFieldId",
                table: "GameStates",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<int>(
                name: "GameStateId",
                table: "Games",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<string>(
                name: "DiceRollResults",
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

            migrationBuilder.AddForeignKey(
                name: "FK_Games_GameStates_GameStateId",
                table: "Games",
                column: "GameStateId",
                principalTable: "GameStates",
                principalColumn: "GameStateId");

            migrationBuilder.AddForeignKey(
                name: "FK_GameStates_Characters_CharacterId",
                table: "GameStates",
                column: "CharacterId",
                principalTable: "Characters",
                principalColumn: "CharacterId");

            migrationBuilder.AddForeignKey(
                name: "FK_GameStates_Fields_ActualFieldId",
                table: "GameStates",
                column: "ActualFieldId",
                principalTable: "Fields",
                principalColumn: "FieldId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_GameStates_GameStateId",
                table: "Games");

            migrationBuilder.DropForeignKey(
                name: "FK_GameStates_Characters_CharacterId",
                table: "GameStates");

            migrationBuilder.DropForeignKey(
                name: "FK_GameStates_Fields_ActualFieldId",
                table: "GameStates");

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

            migrationBuilder.AlterColumn<int>(
                name: "CharacterId",
                table: "GameStates",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ActualFieldId",
                table: "GameStates",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "GameStateId",
                table: "Games",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DiceRollResults",
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
                    { "3ebb8db8-59db-4461-a0dd-108c9fd305d1", null, "Author", "AUTHOR" },
                    { "844a72a2-3519-4e63-ad93-909468198681", null, "Admin", "ADMIN" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "88cd4614-c049-4289-92b0-daf800b7f098", 0, "ddaa4c58-d09c-46f7-9b16-8a90a93bce7f", "admin@localhost.test", true, false, null, "ADMIN@LOCALHOST.TEST", "ADMIN@LOCALHOST.TEST", "AQAAAAIAAYagAAAAEACrp5OI/qJdJDp20u36ydwZhq/l8teZhNDRz6hcP0m3NCrqM0MvdIJYy7JN5DIbLA==", null, false, "", false, "admin@localhost.test" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "3ebb8db8-59db-4461-a0dd-108c9fd305d1", "88cd4614-c049-4289-92b0-daf800b7f098" },
                    { "844a72a2-3519-4e63-ad93-909468198681", "88cd4614-c049-4289-92b0-daf800b7f098" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Games_GameStates_GameStateId",
                table: "Games",
                column: "GameStateId",
                principalTable: "GameStates",
                principalColumn: "GameStateId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GameStates_Characters_CharacterId",
                table: "GameStates",
                column: "CharacterId",
                principalTable: "Characters",
                principalColumn: "CharacterId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GameStates_Fields_ActualFieldId",
                table: "GameStates",
                column: "ActualFieldId",
                principalTable: "Fields",
                principalColumn: "FieldId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
