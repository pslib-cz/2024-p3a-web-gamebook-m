using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.Models {
    [Table("Fields")]
    public class Field {
        [Key]
        public int FieldId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Difficulty { get; set; }
        public int numOfCards { get; set; }
        public int DiceRoll1Result { get; set; }
        public int DiceRoll2Result { get; set; }
        public int DiceRoll3Result { get; set; }
        public int DiceRoll4Result { get; set; }
        public int DiceRoll5Result { get; set; }
        public int DiceRoll6Result { get; set; }

        // Nepřítel na poli
        [ForeignKey("Enemy")]
        public int? EnemyId { get; set; }
        public Enemy? Enemy { get; set; }

        // Karty spojené s tímto polem
        public ICollection<Card> Cards { get; set; } = new List<Card>();

        // Obrázek spojený s polem
        [ForeignKey("Image")]
        public int? ImageId { get; set; }
        public Image Image { get; set; }
    }
}
