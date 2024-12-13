public class GameListVM {
    public int Id { get; set; }
    public string? UserId { get; set; }
    public int? GameStateId { get; set; }
}
public class GameDetailVM {
    public int Id { get; set; }
    public string? UserId { get; set; }
    public int? GameStateId { get; set; }
}
public class GameCreateVM {
    public string? UserId { get; set; }
    public int? GameStateId { get; set; }
}
