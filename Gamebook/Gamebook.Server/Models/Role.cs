using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.Models {
    [Table("AspNetRoles")]
    public class Role : IdentityRole<string> {
        public override string Id { get; set; } = Guid.NewGuid().ToString();
        public ICollection<User>? Users { get; set; }
    }
}