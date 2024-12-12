using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class lol114 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "76F6E659-4A8D-4B23-9C85-46A513F76182",
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "93d296c7-5664-4f25-a9f3-aa10688f9526", "AQAAAAIAAYagAAAAEMPMRB7fFJzXEXIHrzTGg9I9cPPN8SvVcdvW1JX5EjCq0UQAXBnZGc24+8F+5MnFYw==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "76F6E659-4A8D-4B23-9C85-46A513F76182",
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "113e45e5-a08a-4d53-8584-5c90ce4e7b53", "AQAAAAIAAYagAAAAEK4rtpIXXwzctgF7SRI8N6F3l91kw5qsfTQZo4WgVXimFosZucFV6ewOS8gfBQro4Q==" });
        }
    }
}
