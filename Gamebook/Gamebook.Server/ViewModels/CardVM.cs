public class CardListVM {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Type { get; set; }
    public int? EnemyId { get; set; }
    public int? ImageId { get; set; }
}

public class CardDetailVM {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Type { get; set; }
    public string Description { get; set; }
    public string? SpecialAbilities { get; set; }
    public int? ImageId { get; set; }
    public int? EnemyId { get; set; }
    public string? EnemyName { get; set; }
    public string? ImageName { get; set; }
    public Dictionary<int, string>? DiceRollResults { get; set; }
    public int? BonusWile { get; set; }
    public int? BonusStrength { get; set; }
    public int? BonusHP { get; set; }
    public string? ClassOnly { get; set; }
}

public class CardCreateVM {
    public string Title { get; set; }
    public string Type { get; set; }
    public string Description { get; set; }
    public string? SpecialAbilities { get; set; }
    public Dictionary<int, string>? DiceRollResults { get; set; }
    public int? ImageId { get; set; }
    public int? EnemyId { get; set; }
    public int? BonusWile { get; set; }
    public int? BonusStrength { get; set; }
    public int? BonusHP { get; set; }
    public string? ClassOnly { get; set; }
}
