public class GameStateListVM {
    public int Id { get; set; }
    public int InventoryId { get; set; }
    public int? CharacterId { get; set; }
    public int? ActualFieldId { get; set; }
}
public class GameStateDetailVM {
    public int Id { get; set; }
    public int InventoryId { get; set; }
    public int? CharacterId { get; set; }
    public int? ActualFieldId { get; set; }
}
public class GameStateCreateVM {
    public int InventoryId { get; set; }
    public int? CharacterId { get; set; }
    public int? ActualFieldId { get; set; }
}
