// ViewModel pro p�enos dat p�i vytv��en� a aktualizaci
public class EnemyVM {
    public int Id { get; set; }
    public string Name { get; set; }
    public int Strength { get; set; }
    public int Will { get; set; }
    public int? RewardCardId { get; set; } // Pouze ID pro RewardCard
}

// ViewModel pro seznam nep��tel (z�kladn� �daje)
public class EnemyListVM {
    public int Id { get; set; }
    public string Name { get; set; }
    public int? RewardCardId { get; set; } // Pouze ID pro RewardCard
}
