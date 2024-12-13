public class InventoryListVM {
    public int Id { get; set; }
    public List<int> CardIds { get; set; }
}
public class InventoryDetailVM {
    public int Id { get; set; }
    public List<int> CardIds { get; set; }
}
public class InventoryCreateVM {
    public List<int> CardIds { get; set; }
}
public class AddCardToInventoryVM {
    public int InventoryId { get; set; }
    public int CardId { get; set; }
}

// ViewModel pro odstranìní karty z inventáøe
public class RemoveCardFromInventoryVM {
    public int InventoryId { get; set; }
    public int CardId { get; set; }
}
