public class CardListVM {
    public int Id { get; set; }
    public string Title { get; set; }
    public int? EnemyId { get; set; }
    public int? ImageId { get; set; }
}
public class CardDetailVM {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string SpecialAbilities { get; set; }
    public int? ImageId { get; set; }
    public int? EnemyId { get; set; }
    public string? EnemyName { get; set; }
    public string? ImageName { get; set; }
}
public class CardCreateVM {
    public string Title { get; set; }
    public string Description { get; set; }
    public string SpecialAbilities { get; set; }
    public string[] DiceRollResults { get; set; }
    public int? ImageId { get; set; }
    public int? EnemyId { get; set; }
}
