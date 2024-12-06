using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.Models {
    [Table("Enemies")]
    public class Enemy {
        [Key]
        public int EnemyId { get; set; }

        public string Name { get; set; }
        public int Strength { get; set; }
        public int Will { get; set; }

        // Odměna v podobě karty
        [ForeignKey("Card")]
        public int? RewardCardId { get; set; }
        public Card RewardCard { get; set; }
    }
}
