// ViewModels pro pøenos dat
using System.Collections.Generic;

namespace Gamebook.Server.ViewModels {
    public class CharacterVM {
        public string Name { get; set; }
        public string Class { get; set; }
        public int Strength { get; set; }
        public int Will { get; set; }
        public int PointsOfDestiny { get; set; }
        public string Backstory { get; set; }
        public string Ability { get; set; }
        public int MaxHP { get; set; }
        public int MaxDificulty { get; set; }
        public int StartingFieldId { get; set; } // Field ID to assign
        public int? ImageId { get; set; } 
    }
    public class CharacterListVM {
    public int Id { get; set; }
    public string Name { get; set; }
    public int StartingFieldId { get; set; } // Pouze ID pro StartingField
    public int? ImageId { get; set; } // Pouze ID pro Image
}

}



