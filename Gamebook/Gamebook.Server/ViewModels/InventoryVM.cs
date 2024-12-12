namespace Gamebook.Server.ViewModels {
    public class InventoryVM {
        public int InventoryId { get; set; }
        public List<int> CardIds { get; set; } = new List<int>();
    }
}
