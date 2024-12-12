// ViewModel pro pøenos dat pøi vytváøení a aktualizaci
public class CardVM {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string SpecialAbilities { get; set; }

    // Výsledky hodu kostkou
    public int DiceRoll1Result { get; set; }
    public int DiceRoll2Result { get; set; }
    public int DiceRoll3Result { get; set; }
    public int DiceRoll4Result { get; set; }
    public int DiceRoll5Result { get; set; }
    public int DiceRoll6Result { get; set; }

    // Pouze ID pro Image a Enemy
    public int? ImageId { get; set; }
    public int? EnemyId { get; set; }
}

// ViewModel pro seznam karet (základní údaje)
public class CardListVM {
    public int Id { get; set; }
    public string Title { get; set; }
    public int? ImageId { get; set; }
    public int? EnemyId { get; set; }
}
