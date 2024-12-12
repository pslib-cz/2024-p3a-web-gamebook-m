public class FieldVM {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int Difficulty { get; set; }
    public int numOfCards { get; set; }
    public int DiceRoll1Result { get; set; }
    public int DiceRoll2Result { get; set; }
    public int DiceRoll3Result { get; set; }
    public int DiceRoll4Result { get; set; }
    public int DiceRoll5Result { get; set; }
    public int DiceRoll6Result { get; set; }
    public int? EnemyId { get; set; } 
    public int? ImageId { get; set; } 
}
public class FieldListVM {
    public int Id { get; set; }
    public string Title { get; set; }
    public int Difficulty { get; set; }
    public int? EnemyId { get; set; }
    public int? ImageId { get; set; }
}
