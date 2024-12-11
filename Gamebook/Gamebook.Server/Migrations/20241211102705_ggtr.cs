using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gamebook.Server.Migrations
{
    /// <inheritdoc />
    public partial class ggtr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Enemies_Cards_RewardCardId",
                table: "Enemies");

            migrationBuilder.DropIndex(
                name: "IX_Enemies_RewardCardId",
                table: "Enemies");

            migrationBuilder.DropColumn(
                name: "NumOfCards",
                table: "Inventories");

            migrationBuilder.AddColumn<int>(
                name: "MaxDificulty",
                table: "Characters",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DiceRoll1Result",
                table: "Fields",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DiceRoll2Result",
                table: "Fields",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DiceRoll3Result",
                table: "Fields",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DiceRoll4Result",
                table: "Fields",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DiceRoll5Result",
                table: "Fields",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DiceRoll6Result",
                table: "Fields",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Fields",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "numOfCards",
                table: "Fields",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EnemyId",
                table: "Cards",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GameStates_ActualFieldId",
                table: "GameStates",
                column: "ActualFieldId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_EnemyId",
                table: "Cards",
                column: "EnemyId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Enemies_EnemyId",
                table: "Cards",
                column: "EnemyId",
                principalTable: "Enemies",
                principalColumn: "EnemyId");

            migrationBuilder.AddForeignKey(
                name: "FK_GameStates_Fields_ActualFieldId",
                table: "GameStates",
                column: "ActualFieldId",
                principalTable: "Fields",
                principalColumn: "FieldId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Enemies_EnemyId",
                table: "Cards");

            migrationBuilder.DropForeignKey(
                name: "FK_GameStates_Fields_ActualFieldId",
                table: "GameStates");

            migrationBuilder.DropIndex(
                name: "IX_GameStates_ActualFieldId",
                table: "GameStates");

            migrationBuilder.DropIndex(
                name: "IX_Cards_EnemyId",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "MaxDificulty",
                table: "Characters");

            migrationBuilder.DropColumn(
                name: "DiceRoll1Result",
                table: "Fields");

            migrationBuilder.DropColumn(
                name: "DiceRoll2Result",
                table: "Fields");

            migrationBuilder.DropColumn(
                name: "DiceRoll3Result",
                table: "Fields");

            migrationBuilder.DropColumn(
                name: "DiceRoll4Result",
                table: "Fields");

            migrationBuilder.DropColumn(
                name: "DiceRoll5Result",
                table: "Fields");

            migrationBuilder.DropColumn(
                name: "DiceRoll6Result",
                table: "Fields");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Fields");

            migrationBuilder.DropColumn(
                name: "numOfCards",
                table: "Fields");

            migrationBuilder.DropColumn(
                name: "EnemyId",
                table: "Cards");

            migrationBuilder.AddColumn<int>(
                name: "NumOfCards",
                table: "Inventories",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Enemies_RewardCardId",
                table: "Enemies",
                column: "RewardCardId");

            migrationBuilder.AddForeignKey(
                name: "FK_Enemies_Cards_RewardCardId",
                table: "Enemies",
                column: "RewardCardId",
                principalTable: "Cards",
                principalColumn: "CardId");
        }
    }
}
