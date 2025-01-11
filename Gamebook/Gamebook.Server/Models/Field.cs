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
        public Dictionary<int, string>? DiceRollResults { get; set; }

        [ForeignKey("Card")]
        public int? CardId { get; set; }
        public Card? Card { get; set; }

        [ForeignKey("Image")]
        public int? ImageId { get; set; }
        public Image Image { get; set; }
    }
}
