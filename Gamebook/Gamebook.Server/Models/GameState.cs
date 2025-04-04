﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.Models {
    [Table("GameStates")]
    public class GameState {
        public int GameStateId { get; set; }

        [ForeignKey("Inventory")]
        public int InventoryId { get; set; }
        public Inventory Inventory { get; set; }

        [ForeignKey("Character")]
        public int? CharacterId { get; set; }
        public Character? Character { get; set; }

        [ForeignKey("ActualField")]
        public int? ActualFieldId { get; set; }
        public Field? ActualField { get; set; }
    }
}
