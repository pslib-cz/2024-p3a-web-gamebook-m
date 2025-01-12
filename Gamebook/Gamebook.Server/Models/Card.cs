using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static System.Net.Mime.MediaTypeNames;

namespace Gamebook.Server.Models {
    [Table("Cards")]
    public class Card {
        [Key]
        public int CardId { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string? SpecialAbilities { get; set; }

        public string[]? DiceRollResults { get; set; }

        [ForeignKey("Image")]
        public int? ImageId { get; set; }
        public Image? Image { get; set; }

        [ForeignKey("Enemy")]
        public int? EnemyId { get; set; }
        public Enemy? Enemy { get; set; }
    }
}
