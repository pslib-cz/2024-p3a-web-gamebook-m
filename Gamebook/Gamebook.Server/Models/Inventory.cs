namespace Gamebook.Server.Models
{
    using System.ComponentModel.DataAnnotations.Schema;

    namespace Gamebook.Server.Models
    {
        [Table("Inventories")]
        public class Inventory
        {
            public int InventoryId { get; set; }

            public ICollection<Card> Cards { get; set; } = new List<Card>();
        }
    }
}
