
using System.ComponentModel.DataAnnotations;

namespace Gamebook.Server.ViewModels {
    public class CardVM {
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        public string SpecialAbilities { get; set; }

        // Dice results
        public int DiceRoll1Result { get; set; }
        public int DiceRoll2Result { get; set; }
        public int DiceRoll3Result { get; set; }
        public int DiceRoll4Result { get; set; }
        public int DiceRoll5Result { get; set; }
        public int DiceRoll6Result { get; set; }

        // Foreign keys for associations
        public int? ImageId { get; set; }
        public int? EnemyId { get; set; }
    }


    public class CardListVM {
        public int Id { get; set; }
        public string Title { get; set; }
        public int? ImageId { get; set; }
        public int? EnemyId { get; set; }
    }
}
