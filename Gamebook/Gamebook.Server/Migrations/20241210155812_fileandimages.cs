using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class fileandimages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Root",
                table: "Images",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Alt",
                table: "Images",
                newName: "CreatedById");

            migrationBuilder.AddColumn<byte[]>(
                name: "Content",
                table: "Images",
                type: "BLOB",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<string>(
                name: "ContentType",
                table: "Images",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Images",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<long>(
                name: "Size",
                table: "Images",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_Images_CreatedById",
                table: "Images",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_AspNetUsers_CreatedById",
                table: "Images",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_AspNetUsers_CreatedById",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Images_CreatedById",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "Content",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "ContentType",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "Images");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Images",
                newName: "Root");

            migrationBuilder.RenameColumn(
                name: "CreatedById",
                table: "Images",
                newName: "Alt");
        }
    }
}
