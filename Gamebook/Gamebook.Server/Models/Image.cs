using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.Models {
    [Table("Images")]
    public class Image {
        [Key]
        public int ImageId { get; set; }

        // Cesta k obrázku
        public string Root { get; set; }

        // Alternativní popis obrázku
        public string Alt { get; set; }
    }
}
