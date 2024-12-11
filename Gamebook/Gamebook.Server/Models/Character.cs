using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.Models {
    [Table("Characters")]
    public class Character {
        [Key]
        public int CharacterId { get; set; }

        public string Name { get; set; }
        public string Class { get; set; }
        public int Strength { get; set; }
        public int Will { get; set; }
        public int PointsOfDestiny { get; set; }
        public string Backstory { get; set; }
        public string Ability { get; set; }
        public int MaxHP { get; set; }
        public int MaxDificulty { get; set; }

        // Počáteční pole
        [ForeignKey("Field")]
        public int StartingFieldId { get; set; }
        public Field StartingField { get; set; }

        // Obrázek
        [ForeignKey("Image")]
        public int? ImageId { get; set; }
        public Image Image { get; set; }
    }
}
