using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.Models {
    [Table("Games")]
    public class Game {
        public int GameId { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public User User { get; set; }

        [ForeignKey("GameState")]
        public int? GameStateId { get; set; }
        public GameState? GameState { get; set; }
    }
}
    