// ViewModel pro pøenos dat pøi vytváøení a aktualizaci
public class EnemyVM {
    public int Id { get; set; }
    public string Name { get; set; }
    public int Strength { get; set; }
    public int Will { get; set; }
    public int? RewardCardId { get; set; } // Pouze ID pro RewardCard
}

// ViewModel pro seznam nepøátel (základní údaje)
public class EnemyListVM {
    public int Id { get; set; }
    public string Name { get; set; }
    public int? RewardCardId { get; set; } // Pouze ID pro RewardCard
}
