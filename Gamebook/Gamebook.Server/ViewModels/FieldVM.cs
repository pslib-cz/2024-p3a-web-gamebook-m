public class FieldListVM {
    public int FieldId { get; set; }
    public string Title { get; set; }
    public int Difficulty { get; set; }
    public int? EnemyId { get; set; }
    public int? ImageId { get; set; }
}
public class FieldVM {
    public string Title { get; set; }
    public string Description { get; set; }
    public int Difficulty { get; set; }
    public int numOfCards { get; set; }
    public string[]? DiceRollResults { get; set; }  // Nové pole pro výsledky hodù

    public int? EnemyId { get; set; }
    public int? ImageId { get; set; }
}
