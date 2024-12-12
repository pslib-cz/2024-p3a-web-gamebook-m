// ViewModels pro pøenos dat
public class CharacterVM {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Class { get; set; }
    public int Strength { get; set; }
    public int Will { get; set; }
    public int PointsOfDestiny { get; set; }
    public string Backstory { get; set; }
    public string Ability { get; set; }
    public int MaxHP { get; set; }
    public int MaxDificulty { get; set; }
    public int StartingFieldId { get; set; } // Pouze ID pro StartingField
    public int? ImageId { get; set; } // Pouze ID pro Image
}

public class CharacterListVM {
    public int Id { get; set; }
    public string Name { get; set; }
    public int StartingFieldId { get; set; } // Pouze ID pro StartingField
    public int? ImageId { get; set; } // Pouze ID pro Image
}

