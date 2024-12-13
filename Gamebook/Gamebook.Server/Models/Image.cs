using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.Models {
    [Table("Images")]
    public class Image {
        [Key]
        public int ImageId { get; set; }
        public required string Name { get; set; }
        public required long Size { get; set; }
        public required string ContentType { get; set; }
        public required byte[] Content { get; set; }
        public required DateTime CreatedAt { get; set; } = DateTime.Now;
        [ForeignKey("Field")]
        public string? CreatedById { get; set; }
        public User? CreatedBy { get; set; }

    }
}
