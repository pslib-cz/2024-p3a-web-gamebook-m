using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.Models {
    [Table("Fields")]
    public class Field {
        [Key]
        public int FieldId { get; set; }

        public string Description { get; set; }
        public int Difficulty { get; set; }

        // Nepřítel na poli
        [ForeignKey("Enemy")]
        public int? EnemyId { get; set; }
        public Enemy Enemy { get; set; }

        // Karty spojené s tímto polem
        public ICollection<Card> Cards { get; set; } = new List<Card>();

        // Obrázek spojený s polem
        [ForeignKey("Image")]
        public int? ImageId { get; set; }
        public Image Image { get; set; }
    }
}
