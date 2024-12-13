using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static System.Net.Mime.MediaTypeNames;

namespace Gamebook.Server.Models {
    [Table("Cards")]
    public class Card {
        [Key]
        public int CardId { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public string SpecialAbilities { get; set; }

        // Výsledky hodu kostkou (1–6)
        public int DiceRoll1Result { get; set; }
        public int DiceRoll2Result { get; set; }
        public int DiceRoll3Result { get; set; }
        public int DiceRoll4Result { get; set; }
        public int DiceRoll5Result { get; set; }
        public int DiceRoll6Result { get; set; }

        // Propojení s obrázkem
        [ForeignKey("Image")]
        public int? ImageId { get; set; }
        public Image? Image { get; set; }

        [ForeignKey("Enemy")]
        public int? EnemyId { get; set; }
        public Enemy? Enemy { get; set; }
    }
}
